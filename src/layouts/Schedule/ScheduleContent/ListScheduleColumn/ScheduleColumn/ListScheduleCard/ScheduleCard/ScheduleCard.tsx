import React, { memo, useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Tooltip from '@mui/material/Tooltip'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import { useSortable } from '@dnd-kit/sortable'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { CSS } from '@dnd-kit/utilities'
import { MatchDataType, ScheduleDataType } from '../../../../../../../types/schedule.type'
import { checkLengthTeamOfMatch } from '../../../../../../../utils/function'
import DialogEditMatch from '../../../../../../../components/Dialog/Schedule/EditMatch/DialogEditMatch'
import { useParams } from 'react-router-dom'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { useSelector } from 'react-redux'
import { matchDuplicateSelector } from '../../../../../../../redux/reducers/schedule/schedule.selectors'
import { Button, Chip, Menu, MenuItem } from '@mui/material'
import { DialogEditEvent } from '../../../../../../../components/Dialog/MatchEvent/EditEvent'
import { deleteEvent, editEvent } from '../../../../../../../apis/axios/matchEvent/matchEvent'
import { MatchEvent } from '../../../../../../../types/event'
import { DeleteSweep, EditNote } from '@mui/icons-material'
import { CommonAPIRes } from '../../../../../../../types/common'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import moment from 'moment'

interface ScheduleCardProps {
  card: MatchDataType
  activeDragItemId?: number | null
  render: () => void
  isPastDate?: boolean
  column?: ScheduleDataType
}
const ScheduleCard = ({ card, activeDragItemId, render, isPastDate, column }: ScheduleCardProps) => {
  const [showAction, setShowAction] = useState<boolean>(false)
  const [cardIdAtive, setCardIdActive] = useState<number | null>(null)
  const [editMatch, setEditMatch] = useState<boolean>(false)
  const [matchId, setMatchId] = useState<number | null>(null)
  const [matchOverTime, setMatchOverTime] = useState<MatchDataType[]>([])
  const { duplicateMatch } = useSelector(matchDuplicateSelector)
  const duplicateMatchArray = duplicateMatch?.map((cardDpl: any) => cardDpl.id === card.id)
  const tournamentStatus = useSelector((state: any) => state.tournament.general.status)
  const { tournamentId } = useParams()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { ...card },
    transition: {
      duration: 500,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }
  })
  const checkForcusCard = card.id === activeDragItemId

  const event: MatchEvent =
    card?.type === 'EVENT' ? { title: card?.title, timeDuration: card?.timeDuration } : { title: null, timeDuration: 0 }
  const [isOpenDialogEditEvent, setIsOpenDialogEditEvent] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const today = moment(new Date()).format('DD/MM/YYYY')
  const dateOfColumn = moment(column?.date).format('DD/MM/YYYY')

  useEffect(() => {
    if (dateOfColumn === today) {
      if (column?.date) {
        const today = new Date()
        const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()

        const filteredMatch = column?.matches?.filter((match) => match.startTime < time)
        setMatchOverTime(filteredMatch)
      }
    }
  }, [dateOfColumn, today, column])

  const handleClose = () => {
    setAnchorEl(null)
  }

  const dntKitCardStyle = {
    transform: checkForcusCard ? 'rotate(4deg)' : CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '#3498db 1px solid' : ''
  }

  const handleShowAction = (cardId: number, type: string) => {
    if (type === 'MOUSE_ENTER') {
      setCardIdActive(cardId)
      setShowAction(true)
    }
    if (type === 'MOUSE_LEAVE') {
      setShowAction(false)
      setCardIdActive(null)
    }
  }

  const handleEditMatch = (id: number) => {
    setEditMatch(true)
    setMatchId(id)
  }
  const handleDeleteEvent = (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc4848',
      cancelButtonColor: 'transient',
      confirmButtonText: 'Yes, delete it!',
      allowOutsideClick: false,
      focusCancel: true,
      customClass: {
        actions: 'swal2-horizontal-buttons',
        title: 'swal2-custom-title'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = (await deleteEvent(Number(tournamentId), id)) as CommonAPIRes
        if (res.success) {
          toast.success('An event is deleted successfully!')
          render()
        } else {
          toast.error(res.errorMessage?.['NotFound Error'])
        }
      }
    })
  }

  // Css when card has been duplicated
  const borderStyles = duplicateMatchArray?.map((matchDpt: boolean) => {
    if (matchDpt) {
      return '3px solid rgb(245, 124, 0)'
    }
    return 'none'
  })
  const validBorderStyles = borderStyles?.filter((style: string) => style !== 'none')
  const border = validBorderStyles?.join(', ')

  const borderWithRadius = borderStyles?.map((style: string) => {
    if (style !== 'none') {
      return `4px;`
    }
    return style
  })
  const validBorderStylesRadius = borderWithRadius?.filter((style: string) => style !== 'none')
  const borderRadius = validBorderStylesRadius?.join(', ')
  const isMatchOverTime = matchOverTime?.some((v: MatchDataType) => v?.id === card?.id)
  const opacityValue = isMatchOverTime || isPastDate ? '0.7' : '1'
  const cursorValue = isMatchOverTime || isPastDate ? 'none' : 'auto'

  return (
    <>
      {editMatch && card?.type === 'MATCH' && (
        <DialogEditMatch
          editMatch={editMatch}
          setEditMatch={setEditMatch}
          matchId={matchId}
          tournamentId={Number(tournamentId)}
          teamOneDefaultValue={card.teamOne.teamName}
          teamTwoDefaultValue={card.teamTwo.teamName}
          timeDurationDefaultValue={card.timeDuration}
          render={render}
        />
      )}
      <Card
        ref={setNodeRef}
        style={dntKitCardStyle}
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'pointer',
          boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
          overflow: 'unset',
          background: card?.type === 'EVENT' ? '#ffc0aa' : '#fff0ad',
          border: 'none',
          outline: 'none',
          opacity: opacityValue,
          position: 'relative',
          pointerEvents: cursorValue
        }}
        onMouseEnter={() => handleShowAction(Number(card.id), 'MOUSE_ENTER')}
        onMouseLeave={() => handleShowAction(Number(card.id), 'MOUSE_LEAVE')}
      >
        {/* Show DialogEditMatch */}

        <CardContent
          sx={{
            p: 2,
            '&:last-child': {
              p: 2
            },
            display: card?.FE_PlaceholderCard ? 'none' : 'flex',
            alignItems: 'center',
            gap: 1,
            border: border,
            borderRadius: borderRadius
          }}
        >
          {/* Match Card time */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              alignItems: 'center',
              fontSize: '0.8rem',
              width: '45px'
            }}
          >
            <Typography sx={{ fontWeight: '500', fontSize: '12.8px' }}>{card?.startTime?.slice(0, 5)}</Typography>
            <Typography sx={{ fontWeight: '500', fontSize: '12.8px' }}>{card?.endTime?.slice(0, 5)}</Typography>
          </Box>
          {/* Match Card match */}

          {duplicateMatchArray &&
            duplicateMatchArray?.map((matchDuplicate: boolean, index: number) => {
              if (matchDuplicate) {
                return (
                  <Tooltip title="Duplicate matches" placement="top" key={index}>
                    <Button
                      sx={{
                        position: 'absolute',
                        top: '11px',
                        left: '68px',
                        minWidth: '24px !important',
                        minHeight: '16px !important',
                        backgroundColor: 'rgb(245, 124, 0)',
                        '&:hover': {
                          backgroundColor: 'rgb(214 148 79);'
                        },
                        padding: '3px 4px !important'
                      }}
                    >
                      {' '}
                      <WarningAmberIcon fontSize="small" sx={{ color: '#ffdd00' }} />
                    </Button>
                  </Tooltip>
                )
              }
            })}

          {card?.type === 'EVENT' ? (
            <Box sx={{ width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Typography
                  sx={{ maxWidth: '100px', fontWeight: '500', fontSize: '12.8px', textTransform: 'uppercase' }}
                >
                  <Tooltip title={card?.title}>
                    <Chip
                      sx={{
                        backgroundColor: 'transparent',
                        whiteSpace: 'nowrap'
                      }}
                      label={card?.title}
                    />
                  </Tooltip>
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              <Typography sx={{ fontWeight: '500', fontSize: '12.8px' }}>Match</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Tooltip title={card?.teamOne?.teamName?.length > 6 ? card?.teamOne?.teamName : ''} placement="top">
                  <Typography sx={{ fontWeight: '500', fontSize: '12.8px', width: '59px' }}>
                    {checkLengthTeamOfMatch(card?.teamOne?.teamName, 6)}
                  </Typography>
                </Tooltip>
                <Typography sx={{ fontSize: '12.8px' }}>vs</Typography>
                <Tooltip title={card?.teamTwo?.teamName?.length > 6 ? card?.teamTwo?.teamName : ''} placement="top">
                  <Typography sx={{ fontWeight: '500', fontSize: '12.8px', width: '59px' }}>
                    {checkLengthTeamOfMatch(card?.teamTwo?.teamName, 6)}
                  </Typography>
                </Tooltip>
              </Box>
            </Box>
          )}

          {/* CardActions */}

          {cardIdAtive === card?.id && showAction && (
            <CardActions disableSpacing sx={{ position: 'absolute', right: 0, top: 0, cursor: 'pointer' }}>
              {card?.type === 'EVENT' && tournamentStatus !== 'FINISHED' && tournamentStatus !== 'DISCARDED' ? (
                <Tooltip title={!open && !isOpenDialogEditEvent ? 'Options' : ''} placement="right-start">
                  <Box>
                    <MoreHorizIcon
                      id="option-button"
                      aria-controls={open ? 'option-button' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      fontSize="small"
                      onClick={(event: any) => setAnchorEl(event.currentTarget)}
                    />
                    <Menu
                      id="option-button"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem
                        onClick={() => {
                          setIsOpenDialogEditEvent(true)
                          handleClose()
                        }}
                      >
                        <EditNote sx={{ marginRight: '0.75rem' }} />
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleDeleteEvent(Number(card?.id))
                          handleClose()
                        }}
                      >
                        <DeleteSweep sx={{ marginRight: '0.75rem' }} />
                        Delete
                      </MenuItem>
                    </Menu>
                  </Box>
                </Tooltip>
              ) : (
                <Tooltip title="Edit match" placement="right-start">
                  <EditNote fontSize="small" onClick={() => handleEditMatch(Number(card?.id))} />
                </Tooltip>
              )}
            </CardActions>
          )}
          <DialogEditEvent
            editEvent={editEvent}
            onOpen={isOpenDialogEditEvent}
            onClose={() => {
              setIsOpenDialogEditEvent(false)
            }}
            eventId={Number(card?.id)}
            render={render}
            event={event}
          />
        </CardContent>
      </Card>
    </>
  )
}

export default memo(ScheduleCard)
