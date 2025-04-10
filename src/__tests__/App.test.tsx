import { render, screen, waitFor } from '@/test/test-utils'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
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
      expect(screen.getByText('Name 1')).toBeInTheDocument()
    })
  })

  it('shows pagination controls', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.queryByText('Loading comments...')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
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
