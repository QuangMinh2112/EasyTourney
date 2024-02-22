import React, { useEffect } from 'react'
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Tooltip } from '@mui/material'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { editResult } from '../../../apis/axios/tournaments/result'
import { RootState } from '../../../redux/store'
import styles from './DialogEditScore.module.css'
import { ResultSchema } from '../../../services/validator/result.validator'
import { updateResult } from '../../../redux/reducers/result/result.reducer'
import { checkLengthTeam } from '../../../utils/function'
interface EditScoreProps {
  open: boolean
  setOpen: (value: boolean) => void
}

export const DialogEditScore = ({ open, setOpen }: EditScoreProps) => {
  const dispatch = useDispatch()
  const selectedMatch = useSelector((state: any) => state.result.selectedGoal)
  const tournament = useSelector((state: RootState) => {
    const selectedTournament = state.tournament.general
    if (Array.isArray(selectedTournament)) {
      return selectedTournament[0] || {}
    }
    return selectedTournament
  })
  const handleClose = () => {
    setOpen(false)
    formik.resetForm()
  }

  const formik = useFormik({
    initialValues: {
      teamOneResult: selectedMatch.teamOneResult,
      teamTwoResult: selectedMatch.teamTwoResult
    },
    validationSchema: ResultSchema,
    onSubmit: async (values) => {
      try {
        const resultMatch = {
          teamOneResult: values.teamOneResult,
          teamTwoResult: values.teamTwoResult
        }
        await editResult(tournament.id, selectedMatch.id, resultMatch)
        dispatch(
          updateResult({
            matchId: selectedMatch.id,
            teamOneResult: values.teamOneResult,
            teamTwoResult: values.teamTwoResult
          })
        )
        toast.success('Scores are saved successfully!')
        formik.resetForm()
      } catch (error) {
        console.log(error)
      } finally {
        handleClose()
      }
    }
  })
  useEffect(() => {
    if (open) {
      formik.resetForm()
      formik.setValues({
        teamOneResult: selectedMatch.teamOneResult,
        teamTwoResult: selectedMatch.teamTwoResult
      })
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
      sx={{
        '& .MuiDialog-paper': {
          width: '400px !important'
        }
      }}
      open={open}
      onClose={handleClose}
      onClick={handleClickOutside}
    >
      <DialogTitle>Edit Score</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Grid sx={{ alignItems: 'center', textAlign: 'center' }} container spacing={2}>
            <Grid item xs={5}>
              <Box component="label" sx={{ fontWeight: '500' }}>
                <Tooltip title={`${checkLengthTeam(selectedMatch.teamOneName)}`} placement="top">
                  <span> {checkLengthTeam(selectedMatch.teamOneName)}</span>
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                type="number"
                id="teamOneResult"
                name="teamOneResult"
                value={formik.values.teamOneResult}
                onChange={formik.handleChange}
                error={formik.touched.teamOneResult && Boolean(formik.errors.teamOneResult)}
                helperText={
                  formik.touched.teamOneResult && typeof formik.errors.teamOneResult === 'string'
                    ? formik.errors.teamOneResult
                    : ''
                }
                margin="normal"
                sx={{
                  '& .MuiInputBase-input ': {
                    textAlign: 'center'
                  },
                  height: '70px'
                }}
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <Box sx={{ marginTop: '40px', height: '70px' }}>-</Box>
            </Grid>
            <Grid item xs={5}>
              <Box component="label" sx={{ fontWeight: '500' }}>
                <Tooltip title={`${checkLengthTeam(selectedMatch.teamTwoName)}`} placement="top">
                  <span> {checkLengthTeam(selectedMatch.teamTwoName)}</span>
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                type="number"
                id="teamTwoResult"
                name="teamTwoResult"
                value={formik.values.teamTwoResult}
                onChange={formik.handleChange}
                error={formik.touched.teamTwoResult && Boolean(formik.errors.teamTwoResult)}
                helperText={
                  formik.touched.teamTwoResult && typeof formik.errors.teamTwoResult === 'string'
                    ? formik.errors.teamTwoResult
                    : ''
                }
                margin="normal"
                sx={{
                  '& .MuiInputBase-input ': {
                    textAlign: 'center'
                  },
                  height: '70px'
                }}
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
          </Grid>
          <DialogActions className={styles['group-btn']}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}
