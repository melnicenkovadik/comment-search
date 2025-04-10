import { render, screen, fireEvent, waitFor, act } from '../../../test/test-utils'
import userEvent from '@testing-library/user-event'
import { SearchInput } from '../index'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from '@/components/ui/system'
import { ColorModeProvider } from '@/components/ui/color-mode'

const mockOnSearch = vi.fn()
const mockOnAutocomplete = vi.fn()

const renderSearchInput = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <SearchInput
        onSearch={mockOnSearch}
        suggestions={[]}
        isFetching={false}
        onAutocomplete={mockOnAutocomplete}
      />
    </QueryClientProvider>
  )
}

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ChakraProvider value={system}>
      <ColorModeProvider>{component}</ColorModeProvider>
    </ChakraProvider>
  )
}

describe('SearchInput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search input and submit button', () => {
    renderWithProviders(
      <SearchInput
        onSearch={mockOnSearch}
        suggestions={[]}
        isFetching={false}
        onAutocomplete={mockOnAutocomplete}
      />
    )
    expect(screen.getByPlaceholderText('Search comments... (min 3 characters)')).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('validates minimum input length', async () => {
    renderSearchInput()
    const input = screen.getByPlaceholderText('Search comments... (min 3 characters)')

    await act(async () => {
      await userEvent.type(input, 'te')
      const button = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(button)
    })

    expect(mockOnSearch).not.toHaveBeenCalled()
    expect(screen.getByText('Minimum length is 3 characters')).toBeInTheDocument()
  })

  it('calls onSearch with valid input', async () => {
    renderSearchInput()
    const input = screen.getByPlaceholderText('Search comments... (min 3 characters)')

    await act(async () => {
      await userEvent.type(input, 'test')
      const button = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(button)
    })

    expect(mockOnSearch).toHaveBeenCalledWith('test')
  })

  it('calls onAutocomplete after debounce', async () => {
    renderSearchInput()
    const input = screen.getByPlaceholderText('Search comments... (min 3 characters)')

    await act(async () => {
      await userEvent.type(input, 'test')
    })

    await waitFor(
      () => {
        expect(mockOnAutocomplete).toHaveBeenCalledWith('test')
      },
      { timeout: 500 }
    )
  })

  it('shows suggestions when available', () => {
    const suggestions = [{ text: 'test suggestion', fullComment: 'This is a test suggestion' }]

    render(
      <QueryClientProvider client={new QueryClient()}>
        <SearchInput
          onSearch={mockOnSearch}
          suggestions={suggestions}
          isFetching={false}
          onAutocomplete={mockOnAutocomplete}
        />
      </QueryClientProvider>
    )

    expect(screen.getByText('test suggestion')).toBeInTheDocument()
  })
})
