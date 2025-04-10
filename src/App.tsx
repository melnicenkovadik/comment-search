import { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { SearchInput } from '@/components/SearchInput'
import { CommentList } from '@/components/CommentList'
import { Pagination } from '@/components/Pagination'
import { LoadingState } from '@/components/LoadingState'
import { ErrorDisplay } from '@/components/ErrorDisplay'
import { Comment, Suggestion, ApiError, ErrorType } from '@/types'

const COMMENTS_PER_PAGE = 20
const MIN_SEARCH_LENGTH = 3
const MAX_SUGGESTIONS = 5

const fetchComments = async (): Promise<Comment[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/comments')
  if (!response.ok) {
    throw {
      type: response.status >= 500 ? ErrorType.SERVER_ERROR : ErrorType.UNKNOWN_ERROR,
      message: `HTTP error! status: ${response.status}`
    }
  }
  return response.json()
}

function App() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [autocompleteQuery, setAutocompleteQuery] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isSearching, setIsSearching] = useState(false)

  const {
    data: comments,
    isFetching: isLoading,
    error,
    refetch
  } = useQuery<Comment[], ApiError>({
    queryKey: ['comments'],
    queryFn: fetchComments,
    retry: false
  })

  const handleSearch = (query: string) => {
    setIsSearching(true)
    setSearchQuery(query)
    setCurrentPage(1)
    setTimeout(() => setIsSearching(false), 500)
  }

  const handleAutocomplete = (query: string) => {
    setAutocompleteQuery(query)
  }

  const getFilteredComments = () => {
    if (!comments) return []
    if (!searchQuery) return comments

    return comments.filter(comment =>
      comment.body.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const getSuggestions = (): Suggestion[] => {
    if (!autocompleteQuery || !comments || autocompleteQuery.length < MIN_SEARCH_LENGTH) {
      return []
    }

    const query = autocompleteQuery.toLowerCase()
    const suggestions = new Set<string>()
    const result: Suggestion[] = []

    comments.forEach(comment => {
      const text = comment.body.replace(/\s+/g, ' ').trim()
      const lowerText = text.toLowerCase()
      const index = lowerText.indexOf(query)

      if (index !== -1) {
        let end = index + query.length
        while (end < text.length && !/\s/.test(text[end])) {
          end++
        }

        const nextSpace = text.indexOf(' ', end)
        if (nextSpace !== -1 && nextSpace - index < 50) {
          end = nextSpace
        }

        const suggestion = text.slice(index, end).trim()

        if (!suggestions.has(suggestion)) {
          suggestions.add(suggestion)
          result.push({
            text: suggestion,
            fullComment: text
          })
        }
      }
    })

    return result.sort((a, b) => a.text.length - b.text.length).slice(0, MAX_SUGGESTIONS)
  }

  const getPaginatedComments = () => {
    const filteredComments = getFilteredComments()
    return filteredComments.slice(
      (currentPage - 1) * COMMENTS_PER_PAGE,
      currentPage * COMMENTS_PER_PAGE
    )
  }

  const getTotalPages = () => {
    return Math.ceil(getFilteredComments().length / COMMENTS_PER_PAGE)
  }

  if (isLoading) return <LoadingState type="initial" />
  if (error) return <ErrorDisplay error={error} onRetry={refetch} />

  return (
    <Box p={4}>
      <SearchInput
        onSearch={handleSearch}
        suggestions={getSuggestions()}
        isFetching={isLoading}
        onAutocomplete={handleAutocomplete}
      />

      {isSearching ? (
        <LoadingState type="search" />
      ) : (
        <>
          <CommentList comments={getPaginatedComments()} searchQuery={searchQuery} />
          {getTotalPages() > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={getTotalPages()}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </Box>
  )
}

export default App
