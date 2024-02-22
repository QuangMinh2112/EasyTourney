import React from 'react'
import { useMemo } from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { generateRange } from '../utils/function'
interface usePaginationProps {
  totalProductCount: number
  currentPage: number
  siblingCount: number
}

const usePagination = (props: usePaginationProps) => {
  const { totalProductCount, currentPage, siblingCount = 1 } = props
  const paginationArray = useMemo(() => {
    const pageSize = Number(10 || 10)
    const paginationCount = Math.ceil(totalProductCount / pageSize)
    const totalPaginationItem = siblingCount + 5

    if (paginationCount <= totalPaginationItem) return generateRange(1, paginationCount)

    const shouldShowLeftDots = currentPage - siblingCount > 2
    const shouldShowRightDots = currentPage + siblingCount < paginationCount - 1

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightStart = paginationCount - 4
      const rightRange = generateRange(rightStart, paginationCount)

      return [1, <MoreHorizIcon />, ...rightRange]
    }

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = generateRange(1, 5)

      return [...leftRange, <MoreHorizIcon />, paginationCount]
    }

    const siblingLeft = Math.max(currentPage - siblingCount, 1)
    const siblingRight = Math.min(currentPage + siblingCount, paginationCount)

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = generateRange(siblingLeft, siblingRight)
      return [1, <MoreHorizIcon />, ...middleRange, <MoreHorizIcon />, paginationCount]
    }
  }, [totalProductCount, currentPage, siblingCount])
  return paginationArray
}

export default usePagination
