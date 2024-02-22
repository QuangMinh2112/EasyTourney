import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styles from './DialogEditPlayer.module.css'
import { DatePicker } from '@mui/x-date-pickers'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/store'
import dayjs, { Dayjs } from 'dayjs'
import { Player } from '../../../../types/player'
import { PlayerSchema } from '../../../../services/validator/player.validator'
import { useParams } from 'react-router-dom'
import { updatePlayer } from '../../../../redux/reducers/players/players.reducer'

interface DialogEditPlayerProps {
  editPlayer: (tournamentId: number, teamId: number, data: Player) => Promise<any>
  onOpen: boolean
  onClose: () => void
}

const DialogEditPlayer = ({ editPlayer, onOpen, onClose }: DialogEditPlayerProps) => {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const dispatch = useDispatch()
  const selectedPlayer = useSelector((state: RootState) => state.player.selectedPlayer)
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

  const formik = useFormik({
    initialValues: {
      playerName: '',
      dateOfBirth: null as Dayjs | null,
      phone: ''
    },
    validationSchema: PlayerSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        setIsSaving(true)
        const playerData = {
          teamId: teamId,
          playerId: selectedPlayer?.playerId || -1,
          playerName: values.playerName.trim() || '',
          dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : undefined,
          phone: values.phone ? values.phone.trim() : undefined
        }
        const response = await editPlayer(Number(tournamentId), teamId, playerData)

        if (response.success) {
          const updatedPlayer = {
            ...response.data,
            dateOfBirth: response.data.dateOfBirth ? dayjs(response.data.dateOfBirth).format('DD/MM/YYYY') : '',
            phone: response.data.phone || ''
          }
          dispatch(updatePlayer(updatedPlayer))
          toast.success('A player is updated successfully!')
          onClose()
        } else {
          setError({
            playerNameError: response.errorMessage['playerName'],
            dateOfBirthError: response.errorMessage['dateOfBirth'],
            phoneError: response.errorMessage['phone'],
            invalidError: response.errorMessage['Invalid Error']
          })
        }
      } catch (error) {
        toast.error('An error occurred while updating organizer!')
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
        playerName: selectedPlayer?.playerName || '',
        dateOfBirth: selectedPlayer?.dateOfBirth ? dayjs(selectedPlayer.dateOfBirth) : null,
        phone: selectedPlayer?.phone || ''
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

  const disableToday = (date: any) => {
    return dayjs(date).isSame(dayjs().startOf('day'))
  }

  return (
    <Dialog onClick={handleClickOutside} onClose={onClose} open={onOpen}>
      <DialogTitle className={styles['dialog-title']}>Edit Player</DialogTitle>
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
              error={formik.touched.playerName && (Boolean(error.playerNameError) || Boolean(formik.errors.playerName))}
              helperText={
                formik.touched.playerName && (error.playerNameError ? error.playerNameError : formik.errors.playerName)
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
  )
}

export { DialogEditPlayer }
