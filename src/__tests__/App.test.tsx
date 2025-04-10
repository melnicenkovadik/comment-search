import { render, screen, waitFor, fireEvent, act } from '@/test/test-utils'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import App from '../App'

const mockComments = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Name ${i + 1}`,
  email: `email${i + 1}@example.com`,
  body: `Comment body ${i + 1}`
}))

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockComments)
        })
      )
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders loading state initially', () => {
    render(<App />)
    expect(screen.getByText('Loading comments...')).toBeInTheDocument()
  })

  it('displays comments after loading', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.queryByText('Loading comments...')).not.toBeInTheDocument()
    })

    // Wait for comments to be rendered
    await waitFor(() => {
      const comments = screen.getAllByText(/Name \d+/)
      expect(comments).toHaveLength(20)
    })
  })

  it('shows pagination when there are more than 20 comments', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.queryByText('Loading comments...')).not.toBeInTheDocument()
    })

    // Wait for pagination to be rendered
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument()
    })
  })

  it('filters comments based on search query', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.queryByText('Loading comments...')).not.toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search comments... (min 3 characters)')

    await act(async () => {
      await userEvent.type(searchInput, 'Comment body 1')
      const button = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(button)
    })

    await waitFor(() => {
      const highlightedTexts = screen.getAllByText('Comment body 1')
      expect(highlightedTexts.length).toBeGreaterThan(0)
    })
  })

  it('handles API errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: 500
        })
      )
    )

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Server temporarily unavailable')).toBeInTheDocument()
    })
  })
})
