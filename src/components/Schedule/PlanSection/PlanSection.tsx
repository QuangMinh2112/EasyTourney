import { Alert, Box, InputAdornment, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { TimePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import { PlanInformationSchema } from '../../../services/validator/plan.validator'
import styles from './PlanSection.module.css'
import { LoadingButton } from '@mui/lab'
import { Autorenew } from '@mui/icons-material'
import { generateSchedule } from '../../../apis/axios/schedule/schedule'
import { useParams } from 'react-router-dom'
import { ScheduleMatchesAPIRes } from '../../../types/common'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'

interface PlanInformationProps {
  onGenerateSchedule: () => void
}

const PlanSection = ({ onGenerateSchedule }: PlanInformationProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { tournamentId } = useParams()
  const planInformation = useSelector((state: RootState) => state.schedule.planInformation)
  const totalTeams = useSelector((state: RootState) => state.schedule.totalTeams)
  const { status } = useSelector((state: RootState) => state.tournament.general)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [warningMessage, setWarningMessage] = useState<string>('')

  const formik = useFormik({
    initialValues: {
      duration: planInformation?.duration || 0,
      betweenTime: planInformation?.betweenTime || 0,
      startTime: planInformation?.startTime ? dayjs(`1970-01-01 ${planInformation.startTime}`) : (null as Dayjs | null),
      endTime: planInformation?.endTime ? dayjs(`1970-01-01 ${planInformation.endTime}`) : (null as Dayjs | null)
    },

    validateOnChange: false,
    validationSchema: PlanInformationSchema,
    onSubmit: async (values) => {
      try {
        const planInformation = {
          duration: values.duration || 0,
          betweenTime: values.betweenTime || 0,
          startTime: values.startTime ? dayjs(values.startTime).format('HH:mm:ss') : undefined,
          endTime: values.endTime ? dayjs(values.endTime).format('HH:mm:ss') : undefined
        }

        if (status === 'NEED_INFORMATION' || status === 'READY') {
          if (status === 'READY') {
            Swal.fire({
              title: 'Re-generate schedule',
              html: '<p style="margin-top: 0">Generating a new schedule will discard all previously scheduled matches and events!</p> Do you wish to re-generate?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#dc4848',
              cancelButtonColor: 'transient',
              confirmButtonText: 'Yes, re-generate!',
              allowOutsideClick: false,
              focusCancel: true,
              customClass: {
                actions: 'swal2-horizontal-buttons',
                title: 'swal2-custom-title'
              }
            }).then(async (result) => {
              setIsLoading(true)
              if (result.isConfirmed) {
                const response = (await generateSchedule(
                  Number(tournamentId),
                  planInformation
                )) as ScheduleMatchesAPIRes
                if (response.success) {
                  onGenerateSchedule()
                  toast.success('A schedule is generated successfully!')
                } else {
                  toast.error(response?.errorMessage['Invalid Error'])
                }
              }
              setIsLoading(false)
            })
          } else {
            setIsLoading(true)
            const response = (await generateSchedule(Number(tournamentId), planInformation)) as ScheduleMatchesAPIRes
            if (response.success) {
              onGenerateSchedule()
              toast.success('A schedule is generated successfully!')
            } else {
              toast.error(response?.errorMessage['Invalid Error'])
            }
            setIsLoading(false)
          }
        }
      } catch (error) {
        toast.error('An error occurred while configuring plan information!')
      }
    }
  })

  useEffect(() => {
    formik.setValues({
      duration: planInformation?.duration || 0,
      betweenTime: planInformation?.betweenTime || 0,
      startTime: planInformation?.startTime ? dayjs(`1970-01-01 ${planInformation.startTime}`) : (null as Dayjs | null),
      endTime: planInformation?.endTime ? dayjs(`1970-01-01 ${planInformation.endTime}`) : (null as Dayjs | null)
    })
  }, [planInformation])

  useEffect(() => {
    if (totalTeams <= 1 || (status !== 'NEED_INFORMATION' && status !== 'READY')) {
      setIsDisabled(true)
      if (status !== 'NEED_INFORMATION' && status !== 'READY') {
        setWarningMessage(
          'Schedule generation is disabled as the tournament has already started or finished or discarded.'
        )
      } else if (totalTeams <= 1) {
        setWarningMessage(
          'Schedule generation is disabled due to insufficient participating teams. Please ensure an adequate number of teams are registered.'
        )
      }
    } else {
      setIsDisabled(false)
    }
  }, [totalTeams, status])

  return (
    <Box className={styles['plan-container']}>
      <Typography variant="h5" className={styles['plan-title']}>
        Plan Information
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Box className={styles['plan-form']}>
          <Box>
            <Box>
              <Typography className={styles['plan-sub-title']}>Match duration</Typography>
            </Box>
            <TextField
              disabled={isDisabled || isLoading}
              error={formik.touched.duration && Boolean(formik.errors.duration)}
              fullWidth
              helperText={formik.touched.duration && formik.errors.duration}
              id="duration"
              name="duration"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              onKeyPress={(e) => {
                if (e.key === 'E' || e.key === 'e' || e.key === '-' || e.key === '+') {
                  e.preventDefault()
                }
              }}
              type="number"
              value={formik.values.duration}
              InputProps={{
                endAdornment: <InputAdornment position="start">minutes</InputAdornment>,
                inputProps: { min: 0 }
              }}
            />
          </Box>
          <Box>
            <Box component="label">
              <Typography className={styles['plan-sub-title']}>Time between matches</Typography>
            </Box>
            <TextField
              disabled={isDisabled || isLoading}
              error={formik.touched.betweenTime && Boolean(formik.errors.betweenTime)}
              fullWidth
              helperText={formik.touched.betweenTime && formik.errors.betweenTime}
              id="betweenTime"
              name="betweenTime"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              onKeyPress={(e) => {
                if (e.key === 'E' || e.key === 'e' || e.key === '-' || e.key === '+') {
                  e.preventDefault()
                }
              }}
              type="number"
              value={formik.values.betweenTime}
              InputProps={{
                endAdornment: <InputAdornment position="start">minutes</InputAdornment>,
                inputProps: { min: 0 }
              }}
            />
          </Box>
          <Box>
            <Box component="label">
              <Typography className={styles['plan-sub-title']}>Start time of event date</Typography>
            </Box>
            <TimePicker
              ampm={false}
              defaultValue={dayjs()}
              disabled={isDisabled || isLoading}
              value={formik.values.startTime || null}
              onChange={(value) => (value === null ? dayjs() : formik.setFieldValue('startTime', value))}
              slotProps={{
                textField: {
                  onBlur: formik.handleBlur,
                  error: formik.touched.startTime && Boolean(formik.errors.startTime),
                  helperText: formik.touched.startTime && formik.errors.startTime
                }
              }}
              sx={{ width: '100%' }}
            />
          </Box>
          <Box>
            <Box component="label">
              <Typography className={styles['plan-sub-title']}>End time of event date</Typography>
            </Box>
            <TimePicker
              ampm={false}
              disabled={isDisabled || isLoading}
              value={formik.values.endTime || null}
              onChange={(value) => formik.setFieldValue('endTime', value)}
              slotProps={{
                textField: {
                  onBlur: formik.handleBlur,
                  error: formik.touched.endTime && Boolean(formik.errors.endTime),
                  helperText: formik.touched.endTime && formik.errors.endTime
                }
              }}
              sx={{ width: '100%' }}
            />
          </Box>
          <Box className={styles['group-btn']}>
            <LoadingButton
              className={styles['generate-btn']}
              disabled={isDisabled}
              endIcon={<Autorenew />}
              loading={isLoading}
              loadingPosition="end"
              type="submit"
              variant="contained"
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </LoadingButton>
          </Box>
          {isDisabled && (
            <Alert severity="warning" className={styles['warning-message']}>
              {warningMessage}
            </Alert>
          )}
        </Box>
      </form>
    </Box>
  )
}

export default PlanSection
