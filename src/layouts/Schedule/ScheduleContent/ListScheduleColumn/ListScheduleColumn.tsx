import Box from '@mui/material/Box'
import React, { memo } from 'react'
import ScheduleColumn from './ScheduleColumn/ScheduleColumn'
import { ScheduleDataType } from '../../../../types/schedule.type'

interface ListScheduleColumnProps {
  columnData: ScheduleDataType[]
  render: () => void
}

const ListScheduleColumn = ({ columnData, render }: ListScheduleColumnProps) => {
  return (
    <Box
      sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: 'auto',
        display: 'flex',
        borderRadius: '1rem',
        gap: '1rem'
      }}
    >
      {columnData?.map((column: ScheduleDataType) => (
        <ScheduleColumn key={column?.eventDateId} column={column} render={render} />
      ))}
    </Box>
  )
}

export default memo(ListScheduleColumn)
