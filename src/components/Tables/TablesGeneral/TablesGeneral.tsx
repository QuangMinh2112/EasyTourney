import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Box, Button, Chip, Skeleton, Tooltip } from '@mui/material'
import { TiArrowUnsorted } from 'react-icons/ti'
import { TiArrowSortedUp } from 'react-icons/ti'
import { TiArrowSortedDown } from 'react-icons/ti'
import { memo, useState, useEffect } from 'react'
import { ColumnTypes } from '../../../types/common'
import { useSearchParams } from 'react-router-dom'
import noItem from '../../../assets/noItem.png'
import { MdDeleteSweep } from 'react-icons/md'
import moment from 'moment'

interface TableGeneralProps {
  columns: ColumnTypes[]
  rows: { [key: string]: any }[]
  showActions?: boolean
  onDelete?: (rowData: { [key: string]: any }) => void
  handleColumnSort?: (id: any, status: 'asc' | 'desc' | '') => void
  loading?: boolean
}

const TableGeneral = ({
  rows,
  columns,
  showActions = true,
  onDelete,
  handleColumnSort,
  loading
}: TableGeneralProps) => {
  const [sortStates, setSortStates] = useState<{ [key: string]: 'asc' | 'desc' | '' }>(
    Object.fromEntries(columns.map((column) => [column.id, '']))
  )
  const [params] = useSearchParams()
  const myPage = params.get('page')

  const handleSortTableClick = (id: any) => {
    const currentSortType = sortStates[id]

    let nextSortType: 'asc' | 'desc' | ''

    if (currentSortType === 'asc') {
      nextSortType = 'desc'
    } else if (currentSortType === 'desc') {
      nextSortType = ''
    } else {
      nextSortType = 'asc'
    }

    const updatedSortStates = { id, [id]: nextSortType }
    setSortStates(updatedSortStates)
    handleColumnSort?.(id, nextSortType)
  }

  const getColumnSortIcon = (id: any) => {
    const sortType = sortStates[id]

    if (sortType === 'asc') {
      return <TiArrowSortedDown size={15} />
    } else if (sortType === 'desc') {
      return <TiArrowSortedUp size={15} />
    } else {
      return <TiArrowUnsorted size={15} />
    }
  }
  // pagination
  const [page, setPage] = useState(1)
  useEffect(() => {
    // update when delete all records last page
    if (rows?.length === 0 && page > 1) {
      setPage(page - 1)
    }
  }, [page, rows])

  // Loading skeleton
  const TableRowsLoader = ({ rowsNum }: any) => {
    return (
      <>
        {[...Array(rowsNum)].map((row, index) => (
          <TableRow key={index}>
            {columns.map((item, index) => (
              <TableCell component="th" scope="row" key={index}>
                <Skeleton animation="wave" variant="text" />
              </TableCell>
            ))}

            {showActions && (
              <TableCell>
                <Skeleton animation="wave" variant="text" />
              </TableCell>
            )}
          </TableRow>
        ))}
      </>
    )
  }
  const rowsWithPastInfo = rows.map((row) => ({
    ...row,
    isPast: moment(row.date, 'dddd, MMMM D, YYYY - [from] HH:mm [to] HH:mm').isBefore(moment())
  }))
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead
            sx={{
              background: '#0070C1',
              '& .MuiTableHead-root': {
                padding: '8px 16px'
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
          >
            <TableRow>
              {columns?.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    textAlign: `${column.left ? 'left' : 'center'}`,
                    color: 'white',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    borderRight: ' 1px solid rgba(224, 224, 224, 1)',
                    borderCollapse: 'collapse'
                  }}
                  style={{ width: `${column.id === column.style?.filed && column.style.width}` }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '3px',
                      cursor: `${column.sortTable && 'pointer'}`
                    }}
                    onClick={() => {
                      if (column.sortTable && column.id === column.sortBy) {
                        handleSortTableClick(column.id)
                      }
                    }}
                  >
                    <Box>{column.label}</Box>
                    <Box>{column.sortTable && getColumnSortIcon(column.id)}</Box>
                  </Box>
                </TableCell>
              ))}
              {showActions && (
                <TableCell
                  sx={{
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    width: '100px'
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRowsLoader rowsNum={10} />
            ) : rows?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns?.length}>
                  <Box sx={{ textAlign: 'center', color: 'gray', padding: '20px 0px' }}>
                    <Box
                      component="img"
                      src={noItem}
                      alt="no-item"
                      sx={{ width: '100%', height: '200px', objectFit: 'contain' }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              rowsWithPastInfo?.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  sx={{
                    '&:nth-of-type(even)': {
                      backgroundColor: '#f9fafd'
                    }
                  }}
                >
                  {columns?.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      component="td"
                      scope="row"
                      sx={{
                        textAlign: `${column.left ? 'left' : 'center'}`,
                        borderRight: ' 1px solid rgba(224, 224, 224, 1)',
                        borderCollapse: 'collapse'
                      }}
                    >
                      {Object.values(column).indexOf('Id') > -1 ? (
                        (Number(myPage) > 1 ? Number(myPage) - 1 : 0) + rowIndex + 1
                      ) : (
                        <Tooltip title={`${row[column.id as keyof typeof row]}`}>
                          <Chip
                            sx={{
                              backgroundColor: 'transparent',
                              whiteSpace: 'nowrap'
                            }}
                            label={`${row[column.id as keyof typeof row]}`}
                          />
                        </Tooltip>
                      )}
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell
                      scope="row"
                      component="td"
                      sx={{
                        borderRight: '1px solid rgba(224, 224, 224, 1)',
                        borderCollapse: 'collapse'
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center ',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        {onDelete && !row.isPast && (
                          <Button
                            title="Delete"
                            onClick={() => onDelete(row)}
                            sx={{
                              background: 'linear-gradient(195deg, rgb(187 102 102), rgb(241 28 28))',
                              minWidth: '3rem',
                              '&:hover': {
                                opacity: 0.8,
                                backgroundColor: 'red'
                              }
                            }}
                          >
                            <MdDeleteSweep color="white" size={20} />
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default memo(TableGeneral)
