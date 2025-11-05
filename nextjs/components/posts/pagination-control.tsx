"use client"

interface PaginationControlProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

export default function PaginationControl({ currentPage, lastPage, onPageChange }: PaginationControlProps) {
  if (lastPage <= 1) return null

  const generatePageNumbers = () => {
    const pages: (number | string)[] = []
    const maxPagesToShow = 5
    const sidePages = 2

    if (lastPage <= maxPagesToShow) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > sidePages + 2) {
        pages.push("...")
      }

      const start = Math.max(2, currentPage - sidePages)
      const end = Math.min(lastPage - 1, currentPage + sidePages)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      if (currentPage < lastPage - sidePages - 1) {
        pages.push("...")
      }

      pages.push(lastPage)
    }

    return pages
  }

  const pages = generatePageNumbers()

  return (
    <div className="flex justify-center mt-8">
      <div className="join">
        {pages.map((page, index) => (
          <button
            key={index}
            className={`join-item btn ${page === "..." ? "btn-disabled" : page === currentPage ? "btn-active" : ""}`}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  )
}
