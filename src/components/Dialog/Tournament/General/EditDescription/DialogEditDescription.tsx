import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { toast } from 'react-toastify'
import styles from './DialogEditDescription.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../../redux/store'
import { TournamentsEdit } from '../../../../../types/tournament'
import { editGeneralTournament } from '../../../../../apis/axios/tournaments/generalTournaments'
import { setGeneral } from '../../../../../redux/reducers/tournaments/tournaments.reducer'
import { DescriptionSchema } from '../../../../../services/validator/description.validator'

interface DescriptionProps {
  open: boolean
  setOpen: (value: boolean) => void
}

const DialogEditDescription = ({ open, setOpen }: DescriptionProps) => {
  const dispatch = useDispatch()
  const descripton = useSelector((state: RootState) => state.general.selectedDes)
  const tournament = useSelector((state: RootState) => {
    const selectedTournament = state.tournament.general
    if (Array.isArray(selectedTournament)) {
      return selectedTournament[0] || {}
    }
    return selectedTournament
  })
  const formik = useFormik({
    initialValues: {
      description: descripton
    },
    validationSchema: DescriptionSchema,
    onSubmit: async (values) => {
      try {
        const updatedDescription: Partial<TournamentsEdit> = {
          description: values.description
        }
        const response = await editGeneralTournament(tournament.id, updatedDescription)
        dispatch(setGeneral(response.data))
        toast.success('A description is updated successfully!')
      } catch (error) {
        toast.error('Description name has already existed!')
      } finally {
        handleClose()
      }
    }
  })
  useEffect(() => {
    if (open) {
      formik.resetForm()
      formik.setValues({
        description: descripton
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
        PaperProps={{ sx: { borderRadius: '1rem', width: '1000px !important', maxWidth: '600px !important' } }}
      >
        <DialogTitle className={styles['dialog-title']}>Edit Description</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit} className={styles['description-form']}>
            <Box component="label" sx={{ fontWeight: '500' }}>
              Description
            </Box>
            <TextField
              id="description"
              name="description"
              helperText={
                formik.touched.description && typeof formik.errors.description === 'string'
                  ? formik.errors.description
                  : ''
              }
              multiline
              error={formik.touched.description && Boolean(formik.errors.description)}
              onBlur={formik.handleBlur}
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
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

export default DialogEditDescription
