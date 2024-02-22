import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { toast } from 'react-toastify'
import styles from './DialogEditTitle.module.css'
import { TournamentSchema } from '../../../../../services/validator/tournament.validator'
import { useDispatch, useSelector } from 'react-redux'
import { editGeneralTournament } from '../../../../../apis/axios/tournaments/generalTournaments'
import { TournamentsEdit } from '../../../../../types/tournament'
import { RootState } from '../../../../../redux/store'
import { setGeneral } from '../../../../../redux/reducers/tournaments/tournaments.reducer'

interface TournamentTitleProps {
  open: boolean
  setOpen: (value: boolean) => void
}

const DialogEditTournamentTitle = ({ open, setOpen }: TournamentTitleProps) => {
  const dispatch = useDispatch()
  const title = useSelector((state: RootState) => state.general.selectedTitle)
  const tournament = useSelector((state: RootState) => {
    const selectedTournament = state.tournament.general
    if (Array.isArray(selectedTournament)) {
      return selectedTournament[0] || {}
    }
    return selectedTournament
  })
  const formik = useFormik({
    initialValues: {
      title: title
    },
    validationSchema: TournamentSchema,
    onSubmit: async (values) => {
      try {
        const updatedTitle: Partial<TournamentsEdit> = {
          title: values.title
        }
        const response = await editGeneralTournament(tournament.id, updatedTitle)
        dispatch(setGeneral(response.data))
        toast.success('A title tournamnet is updated successfully!')
      } catch (error) {
        toast.error('Title tournamnet has already existed!')
      } finally {
        handleClose()
      }
    }
  })
  useEffect(() => {
    if (open) {
      formik.resetForm()
      formik.setValues({
        title: title
      })
    }
  }, [open])
  const handleClose = () => {
    setOpen(false)
    formik.resetForm()
  }
  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      if (formik.isValid) {
        handleClose()
      }
    }
  }
  return (
    <Box sx={{ textAlign: 'center', paddingTop: '30px' }}>
      <Dialog
        onClick={handleClickOutside}
        onClose={handleClose}
        open={open}
        PaperProps={{ sx: { borderRadius: '1rem' } }}
      >
        <DialogTitle className={styles['dialog-title']}>Edit Title</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit} className={styles['title-form']}>
            <Box component="label" sx={{ fontWeight: '500' }}>
              Title <span className={styles['required-marked']}>*</span>
            </Box>
            <TextField
              error={formik.touched.title && Boolean(formik.errors.title)}
              fullWidth
              helperText={formik.touched.title && typeof formik.errors.title === 'string' ? formik.errors.title : ''}
              id="title"
              name="title"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.title}
              style={{ width: '100%' }}
            />
            <DialogActions className={styles['group-btn']}>
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
    </Box>
  )
}

export default DialogEditTournamentTitle
