import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Badge, Box, Button, Chip, Skeleton, Tooltip } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import { TiArrowUnsorted } from 'react-icons/ti'
import { TiArrowSortedUp } from 'react-icons/ti'
import { TiArrowSortedDown } from 'react-icons/ti'
import { memo, useState, useEffect } from 'react'
import Paginations from '../Paginations'
import { ColumnTypes } from '../../types/common'
import { useSearchParams } from 'react-router-dom'
import noItem from '../../assets/noItem.png'
import { isMultipleLine, isStatus } from '../../utils/function'
import PersonAddAltSharpIcon from '@mui/icons-material/PersonAddAltSharp'
import { AutoMode, Cached, CheckCircleOutline, HelpOutline, HighlightOff } from '@mui/icons-material'
import { MdDeleteSweep, MdEditSquare } from 'react-icons/md'

interface ReusedTableProps {
  columns: ColumnTypes[]
  rows: { [key: string]: any }[]
  showActions?: boolean
  onOpenPlayerDialog?: (rowData: { [key: string]: any }) => void
  onEdit?: (rowData: { [key: string]: any }) => void
  onDelete?: (rowData: { [key: string]: any }) => void
  handleColumnSort?: (id: any, status: 'asc' | 'desc' | '') => void
  total: number
  handlePageSearch?: (page: number) => void
  totalCurrentPage?: number
  loading?: boolean
  isAdded?: boolean
  hidePagination?: boolean
}

const TableReused = ({
  rows,
  columns,
  showActions = true,
  onOpenPlayerDialog,
  onEdit,
  onDelete,
  handleColumnSort,
  total,
  handlePageSearch,
  totalCurrentPage,
  loading,
  isAdded,
  hidePagination = true
}: ReusedTableProps) => {
  const [sortStates, setSortStates] = useState<{ [key: string]: 'asc' | 'desc' | '' }>(
    Object.fromEntries(columns.map((column) => [column.id, '']))
  )
  const [params] = useSearchParams()
  const myPage = params.get('page')
  const totalIndex = totalCurrentPage
    ? totalCurrentPage < 10
      ? totalCurrentPage - totalCurrentPage + 10
      : totalCurrentPage
    : 0

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
      return <TiArrowSortedUp size={15} />
    } else if (sortType === 'desc') {
      return <TiArrowSortedDown size={15} />
    } else {
      return <TiArrowUnsorted size={15} />
    }
  }

  // Return to 1st page and reset sort type when add new record
  useEffect(() => {
    if (isAdded) {
      setSortStates(Object.fromEntries(columns.map((column) => [column.id, ''])))
    }
  }, [isAdded])

  const handlePageChange = (pageNumber: number) => {
    handlePageSearch?.(pageNumber)
  }

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
                    borderCollapse: 'collapse',
                    padding: '6px 12px',
                    paddingLeft: `${column.left ? '24px' : '12px'}`
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
                    <Box sx={{ display: 'flex' }}>{column.sortTable && getColumnSortIcon(column.id)}</Box>
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
                    width: '100px',
                    padding: '6px 12px'
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
                <TableCell colSpan={columns?.length + 1}>
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
              rows?.map((row, rowIndex) => (
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
                        borderCollapse: 'collapse',
                        maxWidth: '120px',
                        minWidth: '50px',
                        padding: '6px 12px'
                      }}
                    >
                      {Object.values(column).indexOf('Id') > -1 ? (
                        (Number(myPage) > 1 ? Number(myPage) - 1 : 0) * totalIndex + rowIndex + 1
                      ) : isStatus(row[column.id]) ? (
                        row[column.id] === 'NEED_INFORMATION' ? (
                          <Chip
                            sx={{ width: '100%', justifyContent: 'flex-start' }}
                            color="warning"
                            variant="outlined"
                            icon={<HelpOutline color="warning" />}
                            label={row[column.id].replace('_', ' ')}
                          />
                        ) : row[column.id] === 'READY' ? (
                          <Chip
                            sx={{ width: '100%', justifyContent: 'flex-start' }}
                            color="primary"
                            variant="outlined"
                            icon={<AutoMode color="primary" />}
                            label={row[column.id].replace('_', ' ')}
                          />
                        ) : row[column.id] === 'IN_PROGRESS' ? (
                          <Chip
                            sx={{ width: '100%', justifyContent: 'flex-start' }}
                            color="secondary"
                            variant="outlined"
                            icon={<Cached color="secondary" />}
                            label={row[column.id].replace('_', ' ')}
                          />
                        ) : row[column.id] === 'FINISHED' ? (
                          <Chip
                            sx={{ width: '100%', justifyContent: 'flex-start' }}
                            color="success"
                            variant="outlined"
                            icon={<CheckCircleOutline color="success" />}
                            label={row[column.id].replace('_', ' ')}
                          />
                        ) : row[column.id] === 'DISCARDED' ? (
                          <Chip
                            sx={{ width: '100%', justifyContent: 'flex-start' }}
                            color="error"
                            variant="outlined"
                            icon={<HighlightOff color="error" />}
                            label={row[column.id].replace('_', ' ')}
                          />
                        ) : (
                          <></>
                        )
                      ) : isMultipleLine(row[column.id]) ? (
                        <ul>
                          <Tooltip title={`${row[column.id]}`} placement="right">
                            <Box
                              sx={{
                                display: '-webkit-box',
                                '-webkit-box-orient': 'vertical',
                                '-webkit-line-clamp': '3',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontSize: '13px'
                              }}
                            >
                              {row[column.id]}
                            </Box>
                          </Tooltip>
                        </ul>
                      ) : column.id !== 'playerCount' ? (
                        <Tooltip
                          title={`${
                            row[column.id] && typeof row[column.id] === 'string'
                              ? row[column.id].replaceAll(' ', '\u00A0')
                              : row[column.id]
                          }`}
                          placement="right"
                        >
                          <Chip
                            sx={{
                              backgroundColor: 'transparent',
                              whiteSpace: 'nowrap'
                            }}
                            label={`${
                              row[column.id] && typeof row[column.id] === 'string'
                                ? row[column.id].replaceAll(' ', '\u00A0')
                                : row[column.id]
                            }`}
                          />
                        </Tooltip>
                      ) : (
                        ''
                      )}
                      {onOpenPlayerDialog &&
                        (Object.values(column).indexOf('playerCount') > -1 && row[column.id] > 0 ? (
                          <Button title="Players" onClick={() => onOpenPlayerDialog(row)}>
                            <Badge badgeContent={row[column.id]} color="default" max={99}>
                              <PersonIcon />
                            </Badge>
                          </Button>
                        ) : Object.values(column).indexOf('playerCount') > -1 ? (
                          <Button title="Players" onClick={() => onOpenPlayerDialog(row)}>
                            <PersonAddAltSharpIcon />
                          </Button>
                        ) : (
                          ''
                        ))}
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell
                      scope="row"
                      component="td"
                      sx={{
                        borderRight: '1px solid rgba(224, 224, 224, 1)',
                        borderCollapse: 'collapse',
                        padding: '6px 12px'
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
                        {onEdit && (
                          <Button
                            title="Edit"
                            onClick={() => onEdit(row)}
                            sx={{
                              background: 'linear-gradient(195deg, rgb(102, 187, 106), rgb(0 107 5))',
                              minWidth: '3rem',
                              '&:hover': {
                                opacity: 0.8,
                                backgroundColor: 'green'
                              }
                            }}
                          >
                            <MdEditSquare color="white" size={20} />
                          </Button>
                        )}
                        {onDelete && (
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
      {hidePagination && total > 10 && (
        <Box sx={{ mt: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <Paginations totalItems={total} itemsPerPage={10} onPageChange={handlePageChange} />
        </Box>
      )}
    </Box>
  )
}

export default memo(TableReused)
