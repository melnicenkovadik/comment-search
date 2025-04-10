import { Box, Flex, Text, Spinner } from '@chakra-ui/react'

interface LoadingStateProps {
  type: 'initial' | 'search' | 'autocomplete'
}

export const LoadingState = ({ type }: LoadingStateProps) => {
  const getLoadingMessage = () => {
    if (type === 'initial') {
      return 'Loading comments...'
    }
    if (type === 'search') {
      return 'Searching comments...'
    }
    return 'Searching suggestions...'
  }

  return (
    <Box
      p={4}
      borderRadius="md"
      bg="blue.50"
      border="1px"
      borderColor="blue.200"
      textAlign="center"
    >
      <Flex direction="column" align="center" gap={2}>
        <Spinner size="md" color="blue.500" />
        <Text color="blue.600">{getLoadingMessage()}</Text>
        {type === 'initial' && (
          <Box width="100%" height="4px" bg="blue.100" borderRadius="full" overflow="hidden" mt={2}>
            <Box
              width="100%"
              height="100%"
              bg="blue.500"
              animation="pulse 1.5s ease-in-out infinite"
            />
          </Box>
        )}
      </Flex>
    </Box>
  )
}
