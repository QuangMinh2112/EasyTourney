import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Alert, Autocomplete, Box, FormControl, InputAdornment, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import styles from './DialogEditMatch.module.css'
import { ScheduleSchemaEditMatch } from '../../../../services/validator/schedule.validator'

import { TeamOfMatch } from '../../../../types/team'
import { editMatchApi } from '../../../../apis/axios/schedule/schedule'
import { EditMatchAPIRes } from '../../../../types/common'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../redux/store'

interface DialogEditMatchProps {
  editMatch: boolean
  setEditMatch: (value: boolean) => void
  matchId: number | null
  tournamentId: number | null
  teamOneDefaultValue: string | null
  teamTwoDefaultValue: string | null
  timeDurationDefaultValue: number
  render: () => void
}

const DialogEditMatch = ({
  editMatch,
  setEditMatch,
  matchId,
  tournamentId,
  teamOneDefaultValue,
  teamTwoDefaultValue,
  render,
  timeDurationDefaultValue
}: DialogEditMatchProps) => {
  const teams = useSelector((state: RootState) => state.tournament.teams)
  const [error, setError] = React.useState<string>()
  const [errorTeamOne, setErrorTeamOne] = useState<boolean>(false)
  const [errorTeamTwo, setErrorTeamTwo] = useState<boolean>(false)
  const [teamOneValue, setTeamOneValue] = useState<string | null>(null)
  const [teamTwoValue, setTeamTwoValue] = useState<string | null>(null)
  const [teamOneOptions, setTeamOneOptions] = useState<TeamOfMatch[]>(teams)
  const [teamTwoOptions, setTeamTwoOptions] = useState<TeamOfMatch[]>(teams)

  const handleClose = () => {
    setEditMatch(false)
  }
  const formik = useFormik({
    initialValues: {
      duration: 0,
      teamOne: '',
      teamTwo: ''
    },
    validationSchema: ScheduleSchemaEditMatch,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const getTeamOneId = teams?.find((t) => t.teamName === values.teamOne && t.teamId)
        const getTeamTwoId = teams?.find((t) => t.teamName === values.teamTwo && t.teamId)
        const payload = {
          matchDuration: values.duration,
          teamOneId: getTeamOneId?.teamId,
          teamTwoId: getTeamTwoId?.teamId
        }

        const res = (await editMatchApi(Number(tournamentId), Number(matchId), payload)) as EditMatchAPIRes
        if (res?.success) {
          toast.success('Edit match successfully !')
          handleClose()
          render()
        } else {
          setError(res?.errorMessage['Invalid Error'])
        }
      } catch (error) {
        toast.error('An error occurred while configuring edit match!')
      }
    }
  })

  const handleBlurTeamOne = () => {
    if (formik.errors.teamOne) {
      setErrorTeamOne(false)
    }
    if (teamOneValue === '' || teamOneValue === null) {
      setErrorTeamOne(true)
    }
  }
  const handleBlurTeamTwo = () => {
    if (formik.errors.teamTwo) {
      setErrorTeamTwo(false)
    }
    if (teamTwoValue === '' || teamTwoValue === null) {
      setErrorTeamTwo(true)
    }
  }

  const handleTeamOneChange = (event: any, value: any) => {
    setTeamOneValue(value)
    formik.setFieldValue('teamOne', value)
    if (value || teamTwoValue) {
      const filteredOptions = teams.filter((option) => option.teamName !== value)
      setTeamTwoOptions(filteredOptions)
    } else {
      setTeamTwoOptions(teams)
    }
  }

  const handleTeamTwoChange = (event: any, value: any) => {
    setTeamTwoValue(value)
    formik.setFieldValue('teamTwo', value)
    if (value || teamOneValue) {
      const filteredOptions = teams.filter((option) => option.teamName !== value)
      setTeamOneOptions(filteredOptions)
    } else {
      const filteredOptions = teams.filter((option) => option.teamName !== teamOneValue)
      setTeamOneOptions(filteredOptions)
    }
  }
  useEffect(() => {
    if (teamOneDefaultValue || teamTwoDefaultValue || timeDurationDefaultValue) {
      setTeamOneValue(teamOneDefaultValue)
      handleTeamOneChange(undefined, teamOneDefaultValue)
      handleTeamTwoChange(undefined, teamTwoDefaultValue)
      setTeamTwoValue(teamTwoDefaultValue)
      formik.setFieldValue('duration', timeDurationDefaultValue)
    }
  }, [teamOneDefaultValue, teamTwoDefaultValue, timeDurationDefaultValue])

  return (
    <Dialog open={editMatch}>
      <DialogTitle id="alert-dialog-title">{'Edit Match'}</DialogTitle>
      {error && (
        <Alert className={styles['alert-message']} severity="error">
          {error}
        </Alert>
      )}
      <DialogContent>
        <form onSubmit={formik.handleSubmit} className={styles['edit-match-form-container']}>
          <Box>
            <Box>
              <Typography>Match duration</Typography>
            </Box>
            <TextField
              fullWidth
              id="duration"
              name="duration"
              type="number"
              error={formik.touched.duration && Boolean(formik.errors.duration)}
              helperText={formik.touched.duration && formik.errors.duration}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.duration}
              InputProps={{
                endAdornment: <InputAdornment position="start">minutes</InputAdornment>,
                inputProps: { min: 0 }
              }}
              sx={{
                '& .MuiFormHelperText-root': {
                  marginLeft: '2px'
                }
              }}
            />
          </Box>
          {/* Select team */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Team One */}
            <FormControl fullWidth sx={{ height: '104px' }}>
              <Box component="label">Team One</Box>
              <Autocomplete
                options={teamOneOptions?.map((teamName) => teamName.teamName)}
                value={teamOneValue}
                onChange={handleTeamOneChange}
                onBlur={handleBlurTeamOne}
                ListboxProps={{
                  style: {
                    maxHeight: '195px',
                    whiteSpace: 'pre-wrap'
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="organizers"
                    variant="outlined"
                    error={
                      (teamOneValue === '' || teamOneValue === null) &&
                      errorTeamOne === false &&
                      formik.touched.teamOne &&
                      Boolean(formik.errors.teamOne)
                    }
                    helperText={
                      (teamOneValue === '' || teamOneValue === null) &&
                      errorTeamOne === false &&
                      formik.touched.teamOne &&
                      formik.errors.teamOne
                    }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        padding: '2px'
                      },
                      '& .MuiFormHelperText-root': {
                        marginLeft: '2px'
                      }
                    }}
                  />
                )}
              />
              {errorTeamOne && (teamOneValue === '' || teamOneValue === null) ? (
                <Box component="span" className={styles['team-error']}>
                  Team one is required
                </Box>
              ) : null}
            </FormControl>
            {/* icon */}
            <Box> - </Box>

            {/* Team Two */}
            <FormControl fullWidth sx={{ height: '104px' }}>
              <Box component="label">Team Two</Box>
              <Autocomplete
                options={teamTwoOptions?.map((teamName) => teamName.teamName)}
                value={teamTwoValue}
                onChange={handleTeamTwoChange}
                onBlur={handleBlurTeamTwo}
                ListboxProps={{
                  style: {
                    maxHeight: '195px',
                    whiteSpace: 'pre-wrap'
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="organizers"
                    variant="outlined"
                    error={
                      (teamTwoValue === '' || teamTwoValue === null) &&
                      errorTeamTwo === false &&
                      formik.touched.teamTwo &&
                      Boolean(formik.errors.teamTwo)
                    }
                    helperText={
                      (teamTwoValue === '' || teamTwoValue === null) &&
                      errorTeamTwo === false &&
                      formik.touched.teamTwo &&
                      formik.errors.teamTwo
                    }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        padding: '2px'
                      },
                      '& .MuiFormHelperText-root': {
                        marginLeft: '2px'
                      }
                    }}
                  />
                )}
              />
              {errorTeamTwo && (teamTwoValue === '' || teamTwoValue === null) ? (
                <Box component="span" className={styles['team-error']}>
                  Team two is required
                </Box>
              ) : null}
            </FormControl>
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
export default DialogEditMatch
