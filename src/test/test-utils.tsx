import { render as rtlRender, screen, waitFor, fireEvent, act } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { ColorModeProvider } from '@/components/ui/color-mode'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { system } from '@/components/ui/system'
import React from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

function render(ui: React.ReactElement, { ...renderOptions } = {}) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <ColorModeProvider>{children}</ColorModeProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )

  Wrapper.displayName = 'TestWrapper'

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

export { render, screen, waitFor, fireEvent, act }
