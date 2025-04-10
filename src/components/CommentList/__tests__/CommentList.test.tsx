import { render, screen, fireEvent } from '@/test/test-utils'
import { CommentList } from '../index'
import { describe, it, expect } from 'vitest'

const mockComments = [
  {
    id: 1,
    name: 'Test Name',
    email: 'test@example.com',
    body: 'This is a test comment that is longer than 64 characters and should be truncated in the preview.'
  },
  {
    id: 2,
    name: 'Short Comment',
    email: 'short@example.com',
    body: 'This is a short comment.'
  }
]

describe('CommentList', () => {
  it('renders comments correctly', () => {
    render(<CommentList comments={mockComments} searchQuery="" />)

    expect(screen.getByText('Test Name')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText(/This is a test comment.*\.\.\./)).toBeInTheDocument()
  })

  it('shows full comment text when expanded', () => {
    render(<CommentList comments={mockComments} searchQuery="" />)

    const trigger = screen.getByText('Test Name').closest('button')
    expect(trigger).toBeInTheDocument()

    if (trigger) {
      fireEvent.click(trigger)
      expect(screen.getByText(mockComments[0].body)).toBeInTheDocument()
    }
  })

  it('highlights search query in text', () => {
    render(<CommentList comments={mockComments} searchQuery="test" />)

    const highlightedElements = screen.getAllByText(/test/i)
    expect(highlightedElements.length).toBeGreaterThan(0)
    expect(highlightedElements[0]).toHaveStyle('background-color: rgb(255, 255, 0)')
  })

  it('shows "No comments found" when empty', () => {
    render(<CommentList comments={[]} searchQuery="" />)

    expect(screen.getByText('No comments found')).toBeInTheDocument()
  })

  it('shows short comments without truncation', () => {
    render(<CommentList comments={[mockComments[1]]} searchQuery="" />)

    const shortCommentElements = screen.getAllByText('This is a short comment.')
    expect(shortCommentElements[0]).toBeInTheDocument()
  })

  it('truncates long comments to 64 characters', () => {
    render(<CommentList comments={mockComments} />)

    const truncatedText = 'This is a test comment that is longer than 64 characters and sho...'
    expect(screen.getByText(truncatedText)).toBeInTheDocument()
  })

  it('highlights search query in comments', () => {
    render(<CommentList comments={mockComments} searchQuery="test" />)

    const highlightedTexts = screen.getAllByText('test')
    expect(highlightedTexts[0]).toHaveStyle('background-color: rgb(255, 255, 0)')
  })

  it('shows search query in no results message', () => {
    render(<CommentList comments={[]} searchQuery="test query" />)
    expect(screen.getByText('No results found for "test query"')).toBeInTheDocument()
  })
})
