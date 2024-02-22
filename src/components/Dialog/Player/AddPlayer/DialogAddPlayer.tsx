import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import styles from './DialogAddPlayer.module.css'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { Player } from '../../../../types/player'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../redux/store'
import { useParams } from 'react-router-dom'
import { PlayerSchema } from '../../../../services/validator/player.validator'
import { AddCircle } from '@mui/icons-material'

interface DialogAddPlayerProps {
  addPlayer: (tournamentId: number, teamId: number, data: Player) => Promise<any>
  onAdd: () => void
}

const DialogAddPlayer = ({ addPlayer, onAdd }: DialogAddPlayerProps) => {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const { tournamentId } = useParams()
  const teamId = useSelector((state: RootState) => state.player.selectedTeamId)
  const [error, setError] = useState({
    playerNameError: '',
    dateOfBirthError: '',
    phoneError: '',
    invalidError: ''
  })

  const resetError = () => {
    setError({
      playerNameError: '',
      dateOfBirthError: '',
      phoneError: '',
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
      playerName: '',
      dateOfBirth: null,
      phone: ''
    },
    validationSchema: PlayerSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        setIsSaving(true)
        const playerData = {
          playerId: 0,
          playerName: values.playerName.trim(),
          teamId: teamId,
          dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : undefined,
          phone: values.phone ? values.phone.trim() : undefined
        }
        const response = await addPlayer(Number(tournamentId), teamId, playerData)

        if (response.success) {
          onAdd()
          toast.success('A player is created successfully!')
          handleClose()
        } else {
          setError({
            playerNameError: response.errorMessage['playerName'],
            dateOfBirthError: response.errorMessage['dateOfBirth'],
            phoneError: response.errorMessage['phone'],
            invalidError: response.errorMessage['Invalid Error']
          })
        }
      } catch (error) {
        toast.error('An error occurred while adding new player!')
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

  const disableToday = (date: any) => {
    return dayjs(date).isSame(dayjs().startOf('day'))
  }

  return (
    <Box sx={{ padding: '10px 0' }}>
      <Button
        className={styles['add-player-btn']}
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
      <Dialog onClick={handleClickOutside} onClose={handleClose} open={open}>
        <DialogTitle className={styles['dialog-title']}>Create Player</DialogTitle>
        {error.invalidError && (
          <Alert className={styles['alert-message']} severity="error">
            {error.invalidError}
          </Alert>
        )}
        <DialogContent>
          <form onSubmit={formik.handleSubmit} className={styles['player-form']}>
            <Stack>
              <Box component="label" sx={{ fontWeight: '500' }}>
                Full name <span className={styles['required-marked']}>*</span>
              </Box>
              <TextField
                fullWidth
                value={formik.values.playerName}
                id="playerName"
                name="playerName"
                onBlur={formik.handleBlur}
                onChange={(value) => {
                  error.playerNameError = ''
                  formik.handleChange(value)
                }}
                error={
                  formik.touched.playerName && (Boolean(error.playerNameError) || Boolean(formik.errors.playerName))
                }
                helperText={
                  formik.touched.playerName &&
                  (error.playerNameError ? error.playerNameError : formik.errors.playerName)
                }
              />
            </Stack>
            <Stack>
              <Box component="label" sx={{ fontWeight: '500' }}>
                Date of birth
              </Box>
              <DatePicker
                format="DD/MM/YYYY"
                disableFuture
                shouldDisableDate={disableToday}
                value={formik.values.dateOfBirth || null}
                onChange={(date: any) => {
                  error.dateOfBirthError = ''
                  formik.setFieldValue('dateOfBirth', date)
                }}
                slotProps={{
                  textField: {
                    onBlur: formik.handleBlur,
                    error:
                      formik.touched.dateOfBirth &&
                      (Boolean(error.dateOfBirthError) || Boolean(formik.errors.dateOfBirth)),
                    helperText:
                      formik.touched.dateOfBirth &&
                      (error.dateOfBirthError ? error.dateOfBirthError : formik.errors.dateOfBirth)
                  }
                }}
              />
            </Stack>
            <Stack>
              <Box component="label" sx={{ fontWeight: '500' }}>
                Phone number
              </Box>
              <TextField
                fullWidth
                value={formik.values.phone}
                id="phone"
                name="phone"
                onBlur={formik.handleBlur}
                onChange={(value) => {
                  error.phoneError = ''
                  formik.handleChange(value)
                }}
                error={formik.touched.phone && (Boolean(error.phoneError) || Boolean(formik.errors.phone))}
                helperText={formik.touched.phone && (error.phoneError ? error.phoneError : formik.errors.phone)}
              />
            </Stack>
            <DialogActions className={styles['group-btn']}>
              <Button variant="outlined" onClick={handleClose}>
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

export { DialogAddPlayer }
