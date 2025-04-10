import { HStack, Button, Text, IconButton, useBreakpointValue } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const showFirstLast = useBreakpointValue({ base: false, md: true })
  const showPageNumbers = useBreakpointValue({ base: false, sm: true })

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <HStack gap={2} justifyContent="center" flexWrap="wrap">
      {showFirstLast && (
        <IconButton
          aria-label="First page"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          variant="ghost"
          size="sm"
        >
          <ChevronsLeft size={20} />
        </IconButton>
      )}

      <IconButton
        aria-label="Previous page"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="ghost"
        size="sm"
      >
        <ChevronLeft size={20} />
      </IconButton>

      {showPageNumbers &&
        getPageNumbers().map((page, index) =>
          page === '...' ? (
            <Text key={`ellipsis-${index}`}>...</Text>
          ) : (
            <Button
              key={page}
              onClick={() => onPageChange(page as number)}
              variant={currentPage === page ? 'solid' : 'ghost'}
              colorScheme={currentPage === page ? 'blue' : 'gray'}
              size="sm"
            >
              {page}
            </Button>
          )
        )}

      <IconButton
        aria-label="Next page"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="ghost"
        size="sm"
      >
        <ChevronRight size={20} />
      </IconButton>

      {showFirstLast && (
        <IconButton
          aria-label="Last page"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          variant="ghost"
          size="sm"
        >
          <ChevronsRight size={20} />
        </IconButton>
      )}
    </HStack>
  )
}
