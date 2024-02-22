import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { memo, useCallback, useEffect, useState } from 'react'
import styles from './DialogEditEventDateTournament.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { convertDateFormat } from '../../../../../utils/function'
import DiaLogAddEventDateTournamnet from './DialogAddEventDateTournament'
import TablesGeneral from '../../../../Tables/TablesGeneral/TablesGeneral'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import moment from 'moment'
import { getTournamentById } from '../../../../../apis/axios/tournaments/tournament'
import { editGeneralTournament } from '../../../../../apis/axios/tournaments/generalTournaments'
import { setSelectedEventDate } from '../../../../../redux/reducers/general/general.reducer'
import { updatedEventDate } from '../../../../../redux/reducers/tournaments/tournaments.reducer'
import { AddCircle } from '@mui/icons-material'

interface DialogProps {
  open: boolean
  setOpen: (value: boolean) => void
}

const DialogEditEventDateTournament = ({ open, setOpen }: DialogProps) => {
  const columns = [
    {
      id: 'id',
      sortTable: false,
      sortBy: 'Id',
      label: 'No.',
      left: false,
      style: {
        filed: 'Id',
        width: '500px'
      }
    },
    {
      id: 'date',
      sortTable: false,
      label: 'Dates',
      sortBy: 'dates',
      left: false,
      style: {
        filed: 'dates',
        width: '1000px'
      }
    }
  ]
  const eventDates = useSelector((state: any) => state.general.selectedEventDate)
  const { status } = useSelector((state: any) => state.tournament.general)
  const [openAddEventDate, setOpenAddEventDate] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [update] = useState<boolean>(false)
  const dispatch = useDispatch()
  const eventDatesFormatted: any[] = convertDateFormat(eventDates)
  eventDatesFormatted.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)

    return dateA.getTime() - dateB.getTime()
  })

  const handleAddEventDate = () => {
    setOpenAddEventDate(true)
  }
  useEffect(() => {
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update])
  const handleClose = () => {
    setOpen(false)
  }
  const handleDelete = useCallback(
    async (rowData: { [key: string]: any }) => {
      const tournamentId = Number(location.pathname.split('/')[2])
      const dates = rowData.date
      const parsedDate = moment(dates, 'dddd, MMMM D, YYYY - [from] HH:mm [to] HH:mm')
      const formattedDate = parsedDate.format('YYYY-MM-DD')

      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc4848',
        cancelButtonColor: 'transient',
        confirmButtonText: 'Yes, delete it!',
        focusCancel: true,
        allowOutsideClick: false,
        customClass: {
          actions: 'swal2-horizontal-buttons',
          container: 'swal2-container',
          title: 'swal2-custom-title'
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.showLoading()
          try {
            const currentEventDates = await getEventDatesFromBackend(tournamentId)

            if (status === 'NEED_INFORMATION') {
              const updatedEventDates = currentEventDates.filter((eventDate) => {
                return eventDate !== formattedDate
              })
              const eventDateUpdated = await editEventDatesInTournament(tournamentId, updatedEventDates)
              dispatch(setSelectedEventDate(eventDateUpdated.eventDates))
              dispatch(updatedEventDate(eventDateUpdated.eventDates))
              toast.success('EventDate is deleted successfully!')
            } else if (status === 'READY' || status === 'IN_PROGRESS') {
              Swal.fire({
                icon: 'warning',
                title: 'Can not delete',
                text: 'Cannot delete this date because it is containing scheduled matches. Please move all matches from this date to another date before deleting!'
              })
            }
          } catch (error) {
            console.error(error)
          } finally {
            Swal.hideLoading()
          }
        }
      })
    },
    [status]
  )

  const getEventDatesFromBackend = async (tournamentId: number): Promise<string[]> => {
    const tournamentResponse = await getTournamentById(tournamentId)
    const eventDates = tournamentResponse?.data?.eventDates
    const dates = eventDates?.map((date: any) => date.date)
    return dates
  }

  const editEventDatesInTournament = async (tournamentId: number, eventDates: any[]) => {
    try {
      const updateResponse = await editGeneralTournament(tournamentId, { eventDates })
      if (updateResponse.data) {
        return updateResponse.data
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      handleClose()
    }
  }

  return (
    <Box>
      <DiaLogAddEventDateTournamnet
        open={openAddEventDate}
        setOpen={setOpenAddEventDate}
        eventDates={eventDatesFormatted}
      ></DiaLogAddEventDateTournamnet>
      <Dialog
        onClick={handleClickOutside}
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: {
            borderRadius: '1rem',
            width: '50vw!important',
            maxWidth: 'none!important'
          }
        }}
        scroll="paper"
        maxWidth="xl"
        sx={{ zIndex: 1004 }}
      >
        <DialogTitle className={styles['dialog-title']}>Edit Event Dates</DialogTitle>
        <DialogContent className={styles['dialog-container']}>
          <Button
            variant="contained"
            onClick={handleAddEventDate}
            className={styles['add-player-btn']}
            style={{
              background: 'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))',
              color: 'white',
              marginBottom: '10px'
            }}
            endIcon={<AddCircle />}
          >
            Add new
          </Button>
          <TablesGeneral columns={columns} rows={eventDatesFormatted} onDelete={handleDelete} loading={loading} />
        </DialogContent>
        <DialogActions className={styles['group-btn']}>
          <Button style={{ marginRight: '22px' }} variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default memo(DialogEditEventDateTournament)
