import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useFormik } from 'formik'
import { Alert, DialogActions, DialogContent, DialogTitle, FormControl } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import styles from './DialogEditEventDateTournament.module.css'
import { RootState } from '../../../../../redux/store'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import DatePanel from 'react-multi-date-picker/plugins/date_panel'
import moment from 'moment'
import CustomMultipleInput from '../../CustomMultipleInput/CustomMultipleInput'
import { getTournamentById } from '../../../../../apis/axios/tournaments/tournament'
import { editGeneralTournament } from '../../../../../apis/axios/tournaments/generalTournaments'
import { setSelectedEventDate } from '../../../../../redux/reducers/general/general.reducer'
import { updatedEventDate } from '../../../../../redux/reducers/tournaments/tournaments.reducer'
import { EventDate } from '../../../../../types/eventDate'

interface OrganizerProps {
  open: boolean
  setOpen: (value: boolean) => void
  eventDates: EventDate[]
}

const DiaLogAddEventDateTournamnet = ({ open, setOpen, eventDates }: OrganizerProps) => {
  const dispatch = useDispatch()
  const [dates, setDates] = useState<DateObject[] | []>([])
  const [errorDatePicker] = useState<boolean>(false)
  const today = new Date()
  const [isDateSelected, setIsDateSelected] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const eventDate = useSelector((state: any) => state.general.selectedEventDate)
  const date = eventDate.map((eventDate: any) => eventDate.date)
  const tournament = useSelector((state: RootState) => {
    const selectedTournament = state.tournament.general
    if (Array.isArray(selectedTournament)) {
      return selectedTournament[0] || {}
    }
    return selectedTournament
  })
  const handleClose = () => {
    setOpen(false)
    setDates([])
    setIsDateSelected(false)
    formik.resetForm()
  }
  const formik = useFormik({
    initialValues: {
      eventDates: date
    },
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const currentEventDates = await getEventDatesFromBackend(tournament.id)
        const dates = currentEventDates.map((eventDate: any) => eventDate.date)
        const duplicateDates = values.eventDates.filter((date: string) => dates.includes(date))
        const formattedDates = duplicateDates.map((date: string) => {
          const [year, month, day] = date.split('-')
          const formattedDate = `${day}/${month}/${year}`
          return formattedDate
        })
        if (formattedDates.length > 0) {
          const duplicateDatesString = formattedDates.join(', ')
          setErrorMessage(`Duplicate event dates detected for ${duplicateDatesString}`)
        } else {
          setErrorMessage(null)
          const updatedEventDates = addNewEventDates(dates, values.eventDates)
          const eventDateUpdated = await editEventDatesInTournament(tournament.id, updatedEventDates)
          dispatch(setSelectedEventDate(eventDateUpdated.eventDates))
          dispatch(updatedEventDate(eventDateUpdated.eventDates))
          toast.success('Event dates updated successfully!')
          formik.resetForm()
          handleClose()
        }
      } catch (error) {
        console.error(error)
      }
    }
  })

  const getEventDatesFromBackend = async (tournamentId: number) => {
    const tournamentResponse = await getTournamentById(tournamentId)
    return tournamentResponse.data ? tournamentResponse.data.eventDates || [] : []
  }

  const addNewEventDates = (currentEventDates: any, newEventDates: any): string[] => {
    return [...currentEventDates, ...newEventDates]
  }

  const editEventDatesInTournament = async (tournamentId: number, dates: any) => {
    try {
      const updateResponse = await editGeneralTournament(tournamentId, { eventDates: dates })
      if (updateResponse.data) {
        const eventDateUpdate = updateResponse.data
        return eventDateUpdate
      } else {
        console.error('Error updating event dates')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (date: DateObject | DateObject[] | null) => {
    if (date) {
      const selectedDates = Array.isArray(date) ? date : [date]

      if (selectedDates.length > 0) {
        setDates(selectedDates)

        const formattedDates = selectedDates.map((d) => moment(d.valueOf()).format('YYYY-MM-DD'))

        formik.setFieldValue('eventDates', formattedDates)
        setIsDateSelected(true)
      } else {
        setIsDateSelected(false)
      }
    } else {
      setIsDateSelected(false)
    }
  }
  useEffect(() => {
    if (open) {
      setErrorMessage(null)
    }
  }, [open])

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      if (formik.isValid) {
        handleClose()
      }
    }
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onClick={handleClickOutside}
      PaperProps={{
        sx: {
          overflowY: 'unset'
        }
      }}
    >
      <Box sx={{ minWidth: '300px' }}>
        <DialogTitle className={styles['dialog-title']}>Add Event Dates</DialogTitle>
        {errorMessage && (
          <Alert className={styles['alert-message']} severity="error" onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </Alert>
        )}
        <DialogContent
          sx={{
            width: '100%',
            height: '200px',
            overflowY: 'initial',
            padding: '0px !important'
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <FormControl fullWidth>
              <DatePicker
                value={dates}
                onChange={handleChange}
                multiple
                sort
                format="DD/MM/YYYY"
                calendarPosition="bottom"
                plugins={[<DatePanel />]}
                minDate={moment(today).add(1, 'day').format('DD/MM/YYYY')}
                placeholder="YYYY/MM/DD"
                render={<CustomMultipleInput errorDatePicker={errorDatePicker} />}
                mapDays={({ date }) => {
                  if (!moment(date.toDate()).isBefore(today)) {
                    if (
                      eventDates.find((eventDate) => moment(eventDate.date).format('DD/MM/YYYY') === date.toString())
                    ) {
                      return {
                        disabled: true
                      }
                    }
                  }
                }}
              />
              {errorDatePicker && dates?.length === 0 ? (
                <Box component="span" className={styles['eventdate-error']}>
                  Event dates is required
                </Box>
              ) : null}
            </FormControl>
            <DialogActions className={styles['group-btn']}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={!isDateSelected}>
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Box>
    </Dialog>
  )
}

export default DiaLogAddEventDateTournamnet
