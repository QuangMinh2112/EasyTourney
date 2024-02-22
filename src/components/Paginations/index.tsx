import React, { memo, useEffect, useState } from 'react'
import { MdOutlineKeyboardDoubleArrowLeft } from 'react-icons/md'
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md'
import { IoIosArrowBack } from 'react-icons/io'
import { IoIosArrowForward } from 'react-icons/io'
import { Box } from '@mui/material'
import styles from './Pagination.module.css'
import { useSearchParams } from 'react-router-dom'

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  onPageChange: (pageNumber: number) => void
}

const Paginations: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [params] = useSearchParams()
  const pageURL = Number(params.get('page'))

  const totalPages: number = Math.ceil(totalItems / itemsPerPage)

  const siblingsToShow = 2
  let start: number, end: number
  if (totalPages <= 5) {
    start = 1
    end = totalPages
  } else if (currentPage <= siblingsToShow) {
    start = 1
    end = siblingsToShow * 2 + 1
  } else if (currentPage >= totalPages - siblingsToShow) {
    start = totalPages - siblingsToShow * 2
    end = totalPages
  } else {
    start = currentPage - siblingsToShow
    end = currentPage + siblingsToShow
  }

  const handlePageClick = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      onPageChange(pageNumber)
    }
  }

  useEffect(() => {
    setCurrentPage(() => pageURL)
  }, [totalItems, pageURL])

  // eslint-disable-next-line
  const pages: JSX.Element[] = []
  if (currentPage >= 1 && !isNaN(totalPages) && totalItems > 0) {
    pages.push(
      <Box
        key="first"
        className={currentPage === 1 ? styles['disabledContent'] : ''}
        sx={{
          height: '32px',
          minWidth: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
        onClick={() => handlePageClick(1)}
      >
        <MdOutlineKeyboardDoubleArrowLeft size={19} />
      </Box>
    )
    pages.push(
      <Box
        key="prev"
        className={currentPage === 1 ? styles['disabledContent'] : ''}
        onClick={() => handlePageClick(currentPage - 1)}
        sx={{
          height: '32px',
          minWidth: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <IoIosArrowBack />
      </Box>
    )
  }

  for (let i = start; i <= end; i++) {
    if (i > 0 && i <= totalPages) {
      pages.push(
        <Box
          key={i}
          onClick={() => handlePageClick(i)}
          sx={{
            height: '32px',
            minWidth: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: `${i === currentPage ? '#6ba1d7' : 'rgba(0, 0, 0, 0.04)'}`
            }
          }}
          style={{
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            KhtmlUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            userSelect: 'none'
          }}
          className={i === currentPage ? styles['activePagination'] : ''}
        >
          {i}
        </Box>
      )
    }
  }

  if (currentPage <= totalPages) {
    pages.push(
      <Box
        key="next"
        className={currentPage === totalPages ? styles['disabledContent'] : ''}
        onClick={() => handlePageClick(currentPage + 1)}
        sx={{
          height: '32px',
          minWidth: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <IoIosArrowForward />
      </Box>
    )
    pages.push(
      <Box
        key="last"
        className={currentPage === totalPages ? styles['disabledContent'] : ''}
        onClick={() => handlePageClick(totalPages)}
        sx={{
          height: '32px',
          minWidth: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <MdOutlineKeyboardDoubleArrowRight size={19} />
      </Box>
    )
  }

  return (
    <Box className="pagination" sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {pages}
    </Box>
  )
}

export default memo(Paginations)
