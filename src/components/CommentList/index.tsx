import { Box, Text } from '@chakra-ui/react'
import { useColorMode } from '@/hooks/use-color-mode'
import { Comment } from '@/types'

interface CommentListProps {
  comments: Comment[]
  searchQuery?: string
}

const COMMENT_LENGTH = 64

const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <>{text}</>

  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'))

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Text
            as="mark"
            key={i}
            bg="yellow.200"
            color="inherit"
            style={{ textDecoration: 'none' }}
          >
            {part}
          </Text>
        ) : (
          part
        )
      )}
    </>
  )
}

export const CommentList = ({ comments, searchQuery = '' }: CommentListProps) => {
  const { colorMode } = useColorMode()

  if (comments.length === 0) {
    return (
      <Box
        mt="4"
        p="4"
        borderWidth="1px"
        borderRadius="md"
        bg={colorMode === 'dark' ? 'gray.800' : 'white'}
        textAlign="center"
      >
        <Text color={colorMode === 'dark' ? 'gray.300' : 'gray.600'} fontSize="lg">
          No results found {searchQuery && `for "${searchQuery}"`}
        </Text>
      </Box>
    )
  }

  return (
    <Box mt="4">
      {comments.map(comment => (
        <Box
          key={comment.id}
          p="4"
          borderWidth="1px"
          borderRadius="md"
          mb="4"
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          boxShadow="sm"
        >
          <Text color={colorMode === 'dark' ? 'white' : 'black'} fontSize="lg" fontWeight="bold">
            {comment.name}
          </Text>
          <Text color="blue.500" fontSize="sm" mb="2">
            {comment.email}
          </Text>
          <Text fontSize="md" color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}>
            <HighlightedText
              text={
                comment.body.length > COMMENT_LENGTH
                  ? comment.body.substring(0, COMMENT_LENGTH) + '...'
                  : comment.body
              }
              highlight={searchQuery}
            />
          </Text>
        </Box>
      ))}
    </Box>
  )
}
