import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styles from './DialogEditTeam.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/store'
import { Team } from '../../../../types/team'
import { TeamSchema } from '../../../../services/validator/team.validator'
import { updateTeams } from '../../../../redux/reducers/teams/teams.reducer'
import { useParams } from 'react-router-dom'

interface DialogEditTeamProps {
  editTeam: (data: Team, tournamentId: number) => Promise<any>
  onOpen: boolean
  onClose: () => void
}

const DialogEditTeam = ({ editTeam, onOpen, onClose }: DialogEditTeamProps) => {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const dispatch = useDispatch()
  const selectedTeam = useSelector((state: RootState) => state.team.selectedTeam)
  const { tournamentId } = useParams()
  const [error, setError] = useState({
    teamNameError: '',
    invalidError: ''
  })

  const resetError = () => {
    setError({
      teamNameError: '',
      invalidError: ''
    })
  }

  const formik = useFormik({
    initialValues: {
      teamName: ''
    },
    validationSchema: TeamSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        setIsSaving(true)
        const teamData = {
          teamId: selectedTeam?.teamId || -1,
          teamName: values.teamName.trim(),
          playerCount: selectedTeam?.playerCount || 0
        }
        const response = await editTeam(teamData, Number(tournamentId))

        if (response.success) {
          const newTeam = {
            ...response.data
          }
          dispatch(updateTeams(newTeam))
          toast.success('A team is updated successfully!')
          onClose()
        } else {
          setError({
            teamNameError: response.errorMessage['teamName'],
            invalidError: response.errorMessage['Invalid Error']
          })
        }
      } catch (error) {
        toast.error('An error occurred while updating team!')
        onClose()
      } finally {
        setIsSaving(false)
      }
    }
  })

  useEffect(() => {
    if (onOpen) {
      resetError()
      formik.resetForm()
      formik.setValues({
        teamName: selectedTeam?.teamName || ''
      })
    }
  }, [onOpen])

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      if (formik.isValid) {
        onClose()
      }
    }
  }

  return (
    <Dialog onClick={handleClickOutside} onClose={onClose} open={onOpen} PaperProps={{ sx: { borderRadius: '1rem' } }}>
      <DialogTitle className={styles['dialog-title']}>Edit Team</DialogTitle>
      {error.invalidError && (
        <Alert className={styles['alert-message']} severity="error">
          {error.invalidError}
        </Alert>
      )}
      <DialogContent>
        <form onSubmit={formik.handleSubmit} className={styles['team-form']}>
          <Stack spacing={2} width={'60vw'} maxWidth={450}>
            <Box component="label" sx={{ fontWeight: '500' }}>
              Team name <span className={styles['required-marked']}>*</span>
            </Box>
            <TextField
              fullWidth
              value={formik.values.teamName}
              id="teamName"
              name="teamName"
              onBlur={formik.handleBlur}
              onChange={(value) => {
                error.teamNameError = ''
                formik.handleChange(value)
              }}
              error={formik.touched.teamName && (Boolean(error.teamNameError) || Boolean(formik.errors.teamName))}
              helperText={
                formik.touched.teamName && (error.teamNameError ? error.teamNameError : formik.errors.teamName)
              }
            />
          </Stack>
          <DialogActions className={styles['group-btn']}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button style={{ marginLeft: '12px' }} variant="contained" type="submit" disabled={isSaving}>
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { DialogEditTeam }
