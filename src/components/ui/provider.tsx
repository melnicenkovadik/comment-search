import { ChakraProvider, EnvironmentProvider, Flex } from '@chakra-ui/react'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { type ThemeProviderProps } from 'next-themes'
import { useEffect, useState } from 'react'
import root from 'react-shadow/emotion'
import { system } from './system'
import { ColorModeProvider, DarkMode, LightMode } from '@/components/ui/color-mode.tsx'
import { useColorMode } from '@/hooks/use-color-mode'
import Header from '@/components/Header'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function Provider(props: ThemeProviderProps) {
  const [shadow, setShadow] = useState<HTMLElement | null>(null)
  const [cache, setCache] = useState<ReturnType<typeof createCache> | null>(null)

  useEffect(() => {
    if (!shadow?.shadowRoot || cache) return
    const emotionCache = createCache({
      key: 'root',
      container: shadow.shadowRoot
    })
    setCache(emotionCache)
  }, [shadow, cache])

  const { colorMode } = useColorMode()
  return (
    <QueryClientProvider client={queryClient}>
      <root.div
        ref={setShadow}
        className="chakra-ui-dark"
        style={{
          display: 'contents',
          width: '100svw',
          height: '100svh',
          backgroundColor: 'var(--chakra-colors-chakra-body-bg)',
          color: 'var(--chakra-colors-chakra-body-text)'
        }}
      >
        {shadow && cache && (
          <EnvironmentProvider value={() => shadow.shadowRoot ?? document}>
            <CacheProvider value={cache}>
              <ChakraProvider value={system}>
                <ColorModeProvider {...props}>
                  <Flex direction="column" h="full" w="full" gap="4">
                    <Header />
                    {colorMode === 'dark' ? (
                      <DarkMode>{props.children}</DarkMode>
                    ) : (
                      <LightMode>{props.children}</LightMode>
                    )}
                  </Flex>
                </ColorModeProvider>
              </ChakraProvider>
            </CacheProvider>
          </EnvironmentProvider>
        )}
      </root.div>
    </QueryClientProvider>
  )
}
