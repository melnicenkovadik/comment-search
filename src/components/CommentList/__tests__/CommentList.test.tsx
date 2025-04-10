import { render, screen } from '@/test/test-utils'
import { CommentList } from '../index'
import { describe, it, expect } from 'vitest'

const mockComments = [
  {
    id: 1,
    name: 'Test Name',
    email: 'test@example.com',
    body: 'This is a test comment that is longer than 64 characters and should be truncated in the display.'
  },
  {
    id: 2,
    name: 'Another Name',
    email: 'another@example.com',
    body: 'Short comment'
  }
]

describe('CommentList', () => {
  it('renders comments with correct information', () => {
    render(<CommentList comments={mockComments} />)
    expect(screen.getByText('Test Name')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('Another Name')).toBeInTheDocument()
    expect(screen.getByText('another@example.com')).toBeInTheDocument()
  })

  it('truncates long comments to 64 characters', () => {
    render(<CommentList comments={mockComments} />)

    const truncatedText = 'This is a test comment that is longer than 64 characters and sho...'
    expect(screen.getByText(truncatedText)).toBeInTheDocument()
  })

  it('does not truncate short comments', () => {
    render(<CommentList comments={mockComments} />)

    expect(screen.getByText('Short comment')).toBeInTheDocument()
  })

  it('highlights search query in comments', () => {
    render(<CommentList comments={mockComments} searchQuery="test" />)

    const highlightedText = screen.getByText('test')
    expect(highlightedText).toHaveStyle('background-color: rgb(255, 255, 0)')
  })

  it('handles empty comments array', () => {
    render(<CommentList comments={[]} />)
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  it('shows search query in no results message', () => {
    render(<CommentList comments={[]} searchQuery="test query" />)
    expect(screen.getByText('No results found for "test query"')).toBeInTheDocument()
  })
})
