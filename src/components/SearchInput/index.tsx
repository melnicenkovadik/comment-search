import { Field, Flex, Input, Box, Text } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useColorMode } from '@/hooks/use-color-mode'
import { useState, useEffect, useCallback, useRef } from 'react'
import debounce from 'lodash/debounce'

interface FormValues {
  query: string
}

interface Suggestion {
  text: string
  fullComment: string
}

interface SearchInputProps {
  onSearch: (query: string) => void
  suggestions: Suggestion[]
  isFetching: boolean
  onAutocomplete: (query: string) => void
}

export const SearchInput = ({
  onSearch,
  suggestions,
  isFetching,
  onAutocomplete
}: SearchInputProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues
  } = useForm<FormValues>()
  const { colorMode } = useColorMode()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const debouncedAutocomplete = useCallback(
    (query: string) => {
      const debouncedFn = debounce((q: string) => {
        if (q.length >= 3) onAutocomplete(q)
      }, 300)
      debouncedFn(query)
      return () => debouncedFn.cancel()
    },
    [onAutocomplete]
  )

  const onSubmit = handleSubmit(data => {
    onSearch(data.query)
    setShowSuggestions(false)
    onAutocomplete('')
  })

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const remainingText = suggestion.text.slice(currentQuery.length)
    const newQuery = currentQuery + remainingText

    setValue('query', newQuery)
    setShowSuggestions(false)
    onAutocomplete('')
    onSearch(newQuery)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveSuggestion(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveSuggestion(prev => (prev > 0 ? prev - 1 : prev))
        break
      case 'Enter':
        e.preventDefault()
        if (activeSuggestion >= 0) {
          handleSuggestionClick(suggestions[activeSuggestion])
        } else {
          onSubmit()
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        break
      case 'Tab':
        if (activeSuggestion >= 0) {
          e.preventDefault()
          handleSuggestionClick(suggestions[activeSuggestion])
        }
        break
    }
  }

  useEffect(() => {
    const subscription = watch(value => {
      if (value.query) {
        setShowSuggestions(true)
        debouncedAutocomplete(value.query)
      } else {
        setShowSuggestions(false)
      }
    })
    return () => {
      subscription.unsubscribe()
      debouncedAutocomplete('')
    }
  }, [watch, debouncedAutocomplete])

  useEffect(() => {
    if (suggestions.length > 0) {
      setShowSuggestions(true)
      setActiveSuggestion(-1)
    }
  }, [suggestions])

  const currentQuery = getValues('query') || ''

  return (
    <Box position="relative">
      <form onSubmit={onSubmit}>
        <Flex gap="4" direction="row" justify="center" align="flex-start">
          <Field.Root invalid={!!errors.query}>
            <Input
              w="full"
              {...register('query', {
                required: false,
                minLength: {
                  value: 3,
                  message: 'Minimum length is 3 characters'
                }
              })}
              ref={e => {
                inputRef.current = e
                register('query').ref(e)
              }}
              color={colorMode === 'dark' ? 'white' : 'black'}
              placeholder="Search comments... (min 3 characters)"
              onFocus={() => {
                if (currentQuery.length >= 3) setShowSuggestions(true)
              }}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 150)
              }}
              onKeyDown={handleKeyDown}
            />
            <Field.ErrorText>{errors.query?.message}</Field.ErrorText>
          </Field.Root>
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              backgroundColor: colorMode === 'dark' ? '#2D3748' : '#EDF2F7',
              color: colorMode === 'dark' ? 'white' : 'black',
              cursor: 'pointer'
            }}
          >
            Submit
          </button>
        </Flex>
      </form>
      {showSuggestions && !isFetching && suggestions.length > 0 && (
        <Box
          ref={suggestionsRef}
          position="absolute"
          width="100%"
          mt={2}
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          borderRadius="md"
          boxShadow="md"
          zIndex={1}
          maxH="200px"
          overflowY="auto"
        >
          {suggestions.map((suggestion, index) => (
            <Box
              key={index}
              p={2}
              cursor="pointer"
              bg={
                activeSuggestion === index
                  ? colorMode === 'dark'
                    ? 'gray.700'
                    : 'gray.100'
                  : 'transparent'
              }
              _hover={{ bg: colorMode === 'dark' ? 'gray.700' : 'gray.100' }}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <Text color={colorMode === 'dark' ? 'white' : 'black'} fontSize="sm">
                <Text as="span" fontWeight="bold">
                  {currentQuery}
                </Text>
                {suggestion.text.slice(currentQuery.length)}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
