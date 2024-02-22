import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  InputAdornment
} from '@mui/material'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { EventSchema } from '../../../../services/validator/event.validator'
import { MatchEvent } from '../../../../types/event'
import styles from './DialogEditEvent.module.css'
import { useParams } from 'react-router'

interface DialogEditEventProps {
  editEvent: (tournamentId: number, data: MatchEvent, eventId: number) => Promise<any>
  onOpen: boolean
  onClose: () => void
  eventId: number
  render: () => void
  event: MatchEvent
}

export function DialogEditEvent({ editEvent, onOpen, onClose, eventId, render, event }: DialogEditEventProps) {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [title, setTitle] = useState<string | undefined | null>(event.title)
  const [timeDuration, setTimeDuration] = useState<number | undefined>(event.timeDuration)
  const [error, setError] = useState({
    eventTitleError: '',
    durationError: '',
    invalidError: ''
  })

  const { tournamentId } = useParams()

  const resetError = () => {
    setError({
      eventTitleError: '',
      durationError: '',
      invalidError: ''
    })
  }

  const formik = useFormik({
    initialValues: {
      title: event?.title,
      durationEvent: event?.timeDuration
    },

    validationSchema: EventSchema,
    onSubmit: async (values) => {
      try {
        setIsSaving(true)
        const updateEvent = {
          title: values?.title?.trim(),
          timeDuration: values?.durationEvent
        }

        const response = await editEvent(Number(tournamentId), updateEvent, eventId)
        if (response.success) {
          setTitle(() => updateEvent.title)
          setTimeDuration(() => updateEvent.timeDuration)
          render()
          toast.success('A event is updated successfully!')
          onClose()
        } else {
          setError({
            eventTitleError: response.errorMessage['title'],
            durationError: response.errorMessage['duration'],
            invalidError: response.errorMessage['Invalid Error']
          })
        }
      } catch (error) {
        toast.error('An error occurred while updating the event!')
        onClose()
      } finally {
        setIsSaving(false)
      }
    }
  })

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      if (formik.isValid) {
        onClose()
      }
    }
  }

  useEffect(() => {
    if (onOpen) {
      resetError()
      formik.resetForm()
      formik.setValues({
        title: title,
        durationEvent: timeDuration
      })
    }
  }, [onOpen])

  return (
    <Box sx={{ textAlign: 'center', paddingTop: '1rem' }}>
      <Dialog open={onOpen} onClose={onClose} onClick={handleClickOutside}>
        <DialogTitle>Edit Event</DialogTitle>
        {error.invalidError && (
          <Alert className={styles['alert-message']} severity="error">
            {error.invalidError}
          </Alert>
        )}
        <DialogContent>
          <form onSubmit={formik.handleSubmit} className={styles['category-form']}>
            <Box>
              <Box component="label" sx={{ fontWeight: '500' }}>
                Title <span className={styles['required-marked']}>*</span>
              </Box>
              <TextField
                fullWidth
                id="title"
                name="title"
                value={formik.values.title}
                onChange={(value) => {
                  error.eventTitleError = ''
                  formik.handleChange(value)
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.title && (Boolean(error.eventTitleError) || Boolean(formik.errors.title))}
                helperText={
                  formik.touched.title && (error.eventTitleError ? error.eventTitleError : formik.errors.title)
                }
              />
            </Box>
            <Box sx={{ marginTop: '20px' }}>
              <Box component="label" sx={{ fontWeight: '500' }}>
                Duration <span className={styles['required-marked']}>*</span>
              </Box>
              <TextField
                fullWidth
                id="durationEvent"
                name="durationEvent"
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="start">minutes</InputAdornment>,
                  inputProps: { min: 0 }
                }}
                value={formik.values.durationEvent}
                onChange={(value) => {
                  error.durationError = ''
                  formik.handleChange(value)
                }}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.durationEvent && (Boolean(error.durationError) || Boolean(formik.errors.durationEvent))
                }
                helperText={
                  formik.touched.durationEvent &&
                  (error.durationError ? error.durationError : formik.errors.durationEvent)
                }
              />
            </Box>
            <DialogActions className={styles['group-btn']}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="contained" type="submit" disabled={isSaving}>
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
