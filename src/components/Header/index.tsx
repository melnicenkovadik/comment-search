import { Flex, Text } from '@chakra-ui/react'
import { ColorModeButton } from '@/components/ui/color-mode.tsx'

export default function Header() {
  return (
    <Flex as="header" width="100%" p={4} align="center" justify="space-between" boxShadow="sm">
      <Text fontSize="xl" fontWeight="bold">
        {window.innerWidth < 768 ? 'Comments Search 👀' : 'Comments Search With Beautiful UI  👀'}
      </Text>
      <ColorModeButton />
    </Flex>
  )
}
