import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import styles from './DialogAddTeam.module.css'
import { Team } from '../../../../types/team'
import { TeamSchema } from '../../../../services/validator/team.validator'
import { useParams } from 'react-router-dom'
import { AddCircle } from '@mui/icons-material'

interface DialogAddTeamProps {
  addTeam: (data: Team, tournamentId: number) => Promise<any>
  onAdd: () => void
}

const DialogAddTeam = ({ addTeam, onAdd }: DialogAddTeamProps) => {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
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

  const handleClickOpen = () => {
    resetError()
    formik.resetForm()
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
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
          teamId: 0,
          teamName: values.teamName.trim(),
          playerCount: 0
        }
        const response = await addTeam(teamData, Number(tournamentId))

        if (response.success) {
          onAdd()
          toast.success('A team is created successfully!')
          handleClose()
        } else {
          setError({
            teamNameError: response.errorMessage['teamName'],
            invalidError: response.errorMessage['Invalid Error']
          })
        }
      } catch (error) {
        toast.error('An error occurred while adding new team!')
        handleClose()
      } finally {
        setIsSaving(false)
      }
    }
  })

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      if (formik.isValid) {
        handleClose()
      }
    }
  }

  return (
    <Box sx={{ textAlign: 'center', paddingTop: '10px' }}>
      <Button
        className={styles['btn-add']}
        variant="contained"
        style={{
          background: 'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))',
          color: 'white'
        }}
        onClick={handleClickOpen}
        endIcon={<AddCircle />}
      >
        Add new
      </Button>
      <Dialog
        onClick={handleClickOutside}
        onClose={handleClose}
        open={open}
        PaperProps={{ sx: { borderRadius: '1rem' } }}
      >
        <DialogTitle className={styles['dialog-title']}>Create Team</DialogTitle>
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
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button style={{ marginLeft: '12px' }} variant="contained" type="submit" disabled={isSaving}>
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export { DialogAddTeam }
