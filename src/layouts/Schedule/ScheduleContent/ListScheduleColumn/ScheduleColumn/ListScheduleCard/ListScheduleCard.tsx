import Box from '@mui/material/Box'
import React, { memo } from 'react'
import ScheduleCard from './ScheduleCard/ScheduleCard'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { MatchDataType, ScheduleDataType } from '../../../../../../types/schedule.type'
interface ListScheduleCardProps {
  cards: MatchDataType[]
  render: () => void
  isPastDate: boolean
  column: ScheduleDataType
}
const ListScheduleCard = ({ cards, render, isPastDate, column }: ListScheduleCardProps) => {
  return (
    <SortableContext items={cards?.map((c: MatchDataType) => c.id)} strategy={verticalListSortingStrategy}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: '0 5px',
          m: '0 5px 8px',
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: (theme) => `calc(100vh - 72px - 115px - ${theme.spacing(5)} - 90px - 80px)`,
          '&::-webkit-scrollbar-thumb': {
            background: '#ced0da'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#bfc2cf'
          }
        }}
      >
        {cards?.map((card: MatchDataType) => (
          <ScheduleCard key={card.id} card={card} render={render} isPastDate={isPastDate} column={column} />
        ))}
      </Box>
    </SortableContext>
  )
}

export default memo(ListScheduleCard)
