import moment from 'moment'
import React, { useState, memo } from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import ListScheduleCard from './ListScheduleCard/ListScheduleCard'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ScheduleDataType } from '../../../../../types/schedule.type'
import EditEventDate from '../../../../../components/Dialog/Schedule/EditEventDate/EditEventDate'
import { DialogAddEvent } from '../../../../../components/Dialog/MatchEvent/AddEvent'
import { addEvent } from '../../../../../apis/axios/matchEvent/matchEvent'
import { useSelector } from 'react-redux'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { timeNotEnough } from '../../../../../redux/reducers/schedule/schedule.selectors'
import { AddCircle } from '@mui/icons-material'

interface ScheduleColumnProps {
  column: ScheduleDataType
  render: () => void
}

const ScheduleColumn = ({ column, render }: ScheduleColumnProps) => {
  const { attributes, setNodeRef, transform, transition } = useSortable({
    id: column.eventDateId,
    data: { ...column }
  })

  const [isOpenDialogAddEvent, setIsOpenDialogAddEvent] = useState(false)
  const tournamentStatus = useSelector((state: any) => state.tournament.general.status)
  const [editEvent, setEditEvent] = useState<boolean>(false)
  const [eventDateId, setEventDateId] = useState<number>()

  const { timeNotEnoughdata } = useSelector(timeNotEnough)
  const today = moment().startOf('day')
  const dateOfColumn = moment(column?.date, 'YYYY/MM/DD')

  const isPastDate = today.isAfter(dateOfColumn, 'day')

  const currentDate = moment()
  const pastDate = moment(column?.date)

  const filteredTimeNotEnoughInEvenDate = timeNotEnoughdata?.eventDateId?.find(
    (eventDateId: number) => eventDateId === column.eventDateId
  )

  const dntKitStyle = {
    transform: CSS.Translate.toString(transform),
    transition
  }

  const handleEditEvenTime = (eventDateId: number) => {
    setEventDateId(eventDateId)
    setEditEvent(true)
  }

  return (
    <Box
      ref={setNodeRef}
      style={dntKitStyle}
      {...attributes}
      sx={{
        maxWidth: '240px',
        minWidth: '240px',
        background: '#333643',
        opacity: isPastDate ? 0.6 : 1,
        borderRadius: '6px',
        border: `${
          timeNotEnoughdata?.eventDateId?.length > 0 && filteredTimeNotEnoughInEvenDate === column?.eventDateId
            ? '3px solid rgb(245, 124, 0)'
            : 'none'
        }`,
        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
        outline: 'none',
        height: 'fit-content',
        maxHeight: (theme) => `calc(100vh - 72px - 88px - ${theme.spacing(5)})`
      }}
    >
      {/* Show popup edit eventime */}
      {editEvent && (
        <EditEventDate
          editEvent={editEvent}
          setEditEvent={setEditEvent}
          eventDateId={eventDateId}
          render={render}
          startTimeDefaultValue={column?.startTime?.slice(0, 5)}
          endTimeDefaultValue={column?.endTime?.slice(0, 5)}
          column={column}
        />
      )}
      {/* Box column header */}
      <Box
        sx={{
          height: '90px',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          backgroundColor: '#1280c3',
          borderRadius: '6px',
          m: `${!column?.startTime || column?.matches[0].FE_PlaceholderCard ? '8px 8px 0 8px' : '8px'}`,
          position: 'relative'
        }}
      >
        {/* Show icon error here */}
        {filteredTimeNotEnoughInEvenDate === column?.eventDateId && (
          <Tooltip title={timeNotEnoughdata?.warningMessage} placement="top">
            <Button
              sx={{
                position: 'absolute',
                left: '8px',
                minWidth: '24px !important',
                minHeight: '16px !important',
                backgroundColor: 'rgb(245, 124, 0)',
                '&:hover': {
                  backgroundColor: 'rgb(214 148 79);'
                },
                padding: '3px 4px !important'
              }}
            >
              <WarningAmberIcon sx={{ color: '#ffdd00' }} />
            </Button>
          </Tooltip>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <Box component="span" sx={{ fontSize: '0.9rem' }}>
            {moment(column?.date, 'YYYY/MM/DD').format('ddd, DD/MM/YYYY')}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="span" sx={{ fontSize: '0.9rem' }}>
              {column?.startTime?.slice(0, 5)} - {column?.endTime?.slice(0, 5)}
            </Box>
          </Box>
        </Box>
        <Box
          component="span"
          sx={{
            cursor: 'pointer',
            position: 'absolute',
            right: '10px',
            pointerEvents: pastDate.isBefore(currentDate, 'day') ? 'none' : 'auto'
          }}
          onClick={() => handleEditEvenTime(column?.eventDateId)}
        >
          <Tooltip title="Edit" placement="top">
            <ModeEditIcon fontSize="small" />
          </Tooltip>
        </Box>
      </Box>
      {/* Box List Card */}
      <ListScheduleCard cards={column?.matches} render={render} isPastDate={isPastDate} column={column} />
      {/* Box footer */}
      {tournamentStatus !== 'NEED_INFORMATION' &&
      tournamentStatus !== 'FINISHED' &&
      tournamentStatus !== 'DISCARDED' ? (
        <Box
          sx={{
            height: '48px',
            p: 1.2,
            display: 'flex',
            justifyContent: 'center',
            color: 'white',
            alignItems: 'center',
            paddingTop: 0
          }}
        >
          <Tooltip title="Add new event" arrow>
            <Button
              endIcon={<AddCircle />}
              sx={{
                width: '100%',
                background: 'rgb(102, 187, 106)',
                color: 'white',
                '& .MuiButton-startIcon': { marginRight: 0 },
                '&:hover': {
                  color: '#fff',
                  background: 'rgb(50, 160, 71)'
                }
              }}
              onClick={() => {
                setIsOpenDialogAddEvent(true)
              }}
            >
              Add event
            </Button>
          </Tooltip>

          <DialogAddEvent
            addEvent={addEvent}
            onOpen={isOpenDialogAddEvent}
            onClose={() => {
              setIsOpenDialogAddEvent(false)
            }}
            eventDateId={column?.eventDateId}
            render={render}
          />
        </Box>
      ) : (
        ''
      )}
    </Box>
  )
}

export default memo(ScheduleColumn)
