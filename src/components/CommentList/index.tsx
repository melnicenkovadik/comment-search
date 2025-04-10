import { Box, Text, VStack, Accordion } from '@chakra-ui/react'
import { useColorMode } from '@/hooks/use-color-mode'
import { Comment } from '@/types'

interface CommentListProps {
  comments: Comment[]
  searchQuery: string
}

const MAX_BODY_LENGTH = 64

const highlightText = (text: string, query: string) => {
  if (!query) return text
  const regex = new RegExp(`(${query})`, 'gi')
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <Text as="span" key={i} bg="yellow" color="black">
        {part}
      </Text>
    ) : (
      part
    )
  )
}

const getTruncatedText = (text: string) => {
  return text.length > MAX_BODY_LENGTH ? `${text.slice(0, MAX_BODY_LENGTH)}...` : text
}

export const CommentList = ({ comments, searchQuery }: CommentListProps) => {
  const { colorMode } = useColorMode()

  if (comments.length === 0) {
    return (
      <Box textAlign="center" p={4}>
        <Text color={colorMode === 'dark' ? 'white' : 'black'}>
          {searchQuery ? `No results found for "${searchQuery}"` : 'No comments found'}
        </Text>
      </Box>
    )
  }

  return (
    <VStack align="stretch" py={4}>
      <Accordion.Root collapsible>
        {comments.map(comment => (
          <Accordion.Item key={comment.id} value={comment.id.toString()}>
            <Accordion.ItemTrigger
              _hover={{ bg: colorMode === 'dark' ? 'gray.700' : 'gray.100' }}
              p={4}
              aria-label={`Expand comment by ${comment.name}`}
            >
              <Box flex="1" textAlign="left">
                <Text fontWeight="bold" color={colorMode === 'dark' ? 'white' : 'black'}>
                  {highlightText(comment.name, searchQuery)}
                </Text>
                <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
                  {highlightText(comment.email, searchQuery)}
                </Text>
                <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}>
                  {highlightText(getTruncatedText(comment.body), searchQuery)}
                </Text>
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody p={4}>
                <Text color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}>
                  {highlightText(comment.body, searchQuery)}
                </Text>
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </VStack>
  )
}
