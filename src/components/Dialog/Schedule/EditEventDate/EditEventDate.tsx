import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { TimePicker } from '@mui/x-date-pickers'
import { useFormik } from 'formik'
import { Alert, Box, Typography } from '@mui/material'
import styles from './EditEventDate.module.css'
import dayjs, { Dayjs } from 'dayjs'
import { toast } from 'react-toastify'
import { ScheduleSchema } from '../../../../services/validator/schedule.validator'
import { EditEventTimeApi } from '../../../../apis/axios/schedule/schedule'
import { useParams } from 'react-router-dom'
import { ScheduleTimeEventAPIRes } from '../../../../types/common'
import { ScheduleDataType } from '../../../../types/schedule.type'
import moment from 'moment'
interface EditEventDateProps {
  editEvent: boolean
  setEditEvent: (value: boolean) => void
  eventDateId?: number
  render: () => void
  startTimeDefaultValue: string
  endTimeDefaultValue: string
  column?: ScheduleDataType
}

const EditEventDate = ({
  editEvent,
  setEditEvent,
  eventDateId,
  render,
  startTimeDefaultValue,
  endTimeDefaultValue,
  column
}: EditEventDateProps) => {
  const { tournamentId } = useParams()
  const [error, setError] = React.useState<string>()
  const [defaultStartTime, setDefaultStartTime] = React.useState<Dayjs | null>(null)
  const [defaultEndTime, setDefaultEndTime] = React.useState<Dayjs | null>(null)
  const [checkTimeIsPast, setCheckTimeIsPast] = React.useState<boolean>(false)
  const handleClose = () => {
    setEditEvent(false)
  }
  const today = moment(new Date()).format('DD/MM/YYYY')
  const dateOfColumn = moment(column?.date).format('DD/MM/YYYY')
  const currentDate = moment()
  const isPastDate = moment(column?.date)

  React.useEffect(() => {
    if (dateOfColumn === today) {
      if (column?.date) {
        const today = new Date()
        const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
        if (time > startTimeDefaultValue) {
          setCheckTimeIsPast(true)
          console.log('code chay vao day')
        }
      }
    }
  }, [dateOfColumn, today, column])

  const formik = useFormik({
    initialValues: {
      startTimeEventDate: null as Dayjs | null,
      endTimeEventDate: null as Dayjs | null
    },
    validationSchema: ScheduleSchema,
    onSubmit: async (values) => {
      try {
        const planInformation = {
          startTime: values.startTimeEventDate && dayjs(values.startTimeEventDate).format('HH:mm'),
          endTime: values.endTimeEventDate && dayjs(values.endTimeEventDate).format('HH:mm')
        }
        const res = (await EditEventTimeApi(
          Number(tournamentId),
          planInformation,
          Number(eventDateId)
        )) as ScheduleTimeEventAPIRes
        if (res?.success) {
          toast.success('Edit event time success !')
          render()
          handleClose()
        } else {
          setError(res?.errorMessage['Invalid Error'])
        }
      } catch (error) {
        toast.error('An error occurred while configuring plan information!')
      }
    }
  })

  React.useEffect(() => {
    if (startTimeDefaultValue) {
      setDefaultStartTime(dayjs(startTimeDefaultValue, 'HH:mm'))
      formik.setFieldValue('startTimeEventDate', dayjs(startTimeDefaultValue, 'HH:mm'))
    }
    if (endTimeDefaultValue) {
      setDefaultEndTime(dayjs(endTimeDefaultValue, 'HH:mm'))
      formik.setFieldValue('endTimeEventDate', dayjs(endTimeDefaultValue, 'HH:mm'))
    }
  }, [startTimeDefaultValue, endTimeDefaultValue])

  return (
    <Dialog
      open={editEvent}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{'Edit Time Event Date'}</DialogTitle>
      {error && (
        <Alert className={styles['alert-message']} severity="error">
          {error}
        </Alert>
      )}

      <DialogContent className={styles['dialog-content-wrapper']}>
        <form onSubmit={formik.handleSubmit} className={styles['edit-time-event-form']}>
          <Box>
            <Box component="label">
              <Typography className={styles['edit-time-event-title']}>Start time of event date</Typography>
            </Box>
            <TimePicker
              ampm={false}
              value={defaultStartTime}
              onChange={(value) => (value === null ? dayjs() : formik.setFieldValue('startTimeEventDate', value))}
              slotProps={{
                textField: {
                  onBlur: formik.handleBlur,
                  error: formik.touched.startTimeEventDate && Boolean(formik.errors.startTimeEventDate),
                  helperText: formik.touched.startTimeEventDate && formik.errors.startTimeEventDate
                }
              }}
              sx={{
                width: '100%',
                '& .MuiFormHelperText-root': {
                  marginLeft: 0
                },
                pointerEvents: checkTimeIsPast || isPastDate.isBefore(currentDate, 'day') ? 'none' : 'auto'
              }}
            />
          </Box>
          <Box>
            <Box component="label">
              <Typography className={styles['edit-time-event-title']}>End time of event date</Typography>
            </Box>
            <TimePicker
              ampm={false}
              value={defaultEndTime}
              onChange={(value) => formik.setFieldValue('endTimeEventDate', value)}
              slotProps={{
                textField: {
                  onBlur: formik.handleBlur,
                  error: formik.touched.endTimeEventDate && Boolean(formik.errors.endTimeEventDate),
                  helperText: formik.touched.endTimeEventDate && formik.errors.endTimeEventDate
                }
              }}
              sx={{
                width: '100%',
                '& .MuiFormHelperText-root': {
                  marginLeft: 0
                }
              }}
            />
          </Box>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button style={{ marginLeft: '12px' }} variant="contained" type="submit">
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditEventDate
