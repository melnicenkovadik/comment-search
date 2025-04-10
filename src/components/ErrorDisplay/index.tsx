import { Box, Text, Button } from '@chakra-ui/react'
import { ErrorType } from '@/types'

interface ErrorDisplayProps {
  error: {
    type: ErrorType
    message: string
  }
  onRetry: () => void
}

export const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  const getErrorMessage = () => {
    if (error.type === ErrorType.NETWORK_ERROR) {
      return 'Connection issues'
    }
    return 'Server temporarily unavailable'
  }

  return (
    <Box p={4} borderRadius="md" bg="red.50" border="1px" borderColor="red.200" textAlign="center">
      <Text color="red.600" mb={2}>
        {getErrorMessage()}
      </Text>
      <Button onClick={onRetry} colorScheme="blue">
        Try again
      </Button>
    </Box>
  )
}
