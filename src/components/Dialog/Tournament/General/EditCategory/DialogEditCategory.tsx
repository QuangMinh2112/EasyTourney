import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useFormik } from 'formik'
import { Autocomplete, DialogActions, DialogContent, DialogTitle, FormControl, TextField } from '@mui/material'
import { CategoryName } from '../../../../../types/category'
import { categoriesSelector } from '../../../../../redux/reducers/categories/categories.selectors'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import styles from './DialogEditCategory.module.css'
import { RootState } from '../../../../../redux/store'
import { TournamentsEdit } from '../../../../../types/tournament'
import { editGeneralTournament } from '../../../../../apis/axios/tournaments/generalTournaments'
import { setGeneral } from '../../../../../redux/reducers/tournaments/tournaments.reducer'

interface EditCategoryInTournamentProps {
  open: boolean
  setOpen: (value: boolean) => void
}

const DiaLogEditCategoryInTournamnet = ({ open, setOpen }: EditCategoryInTournamentProps) => {
  const { listCategory } = useSelector(categoriesSelector)
  const dispatch = useDispatch()
  const [errorCategory, setErrorCategory] = useState<boolean>(false)
  const category = useSelector((state: RootState) => state.general.selectedCategory)
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
      categoryId: category
    },
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const getCategoryId = listCategory?.find((a: any) => a.categoryName === values.categoryId && a.categoryId)
        const updatedCategory: Partial<TournamentsEdit> = {
          categoryId: getCategoryId.categoryId
        }
        const response = await editGeneralTournament(tournament.id, updatedCategory)
        dispatch(setGeneral(response.data))
        toast.success('Category updated successfully!')
        formik.resetForm()
        handleClose()
      } catch (error) {
        console.error(error)
      }
    }
  })

  const selectedValue = formik?.values?.categoryId
  const isOptionExists = listCategory?.some((option: CategoryName) => option.categoryName === selectedValue)

  useEffect(() => {
    if (selectedValue?.length > 0) {
      setErrorCategory(false)
    }
  }, [selectedValue])
  useEffect(() => {
    if (open) {
      formik.resetForm()
      formik.setValues({
        categoryId: category
      })
    }
  }, [open])
  const handleInputChange = (event: React.ChangeEvent<object>, value: string | null) => {
    formik.setFieldValue('category', value && value?.trim())
  }
  const handleBlurCategory = () => {
    if (formik.errors.categoryId) {
      setErrorCategory(false)
    }
    if (selectedValue === '' || selectedValue === null) {
      setErrorCategory(true)
    }
  }
  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      if (formik.isValid) {
        handleClose()
      }
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} onClick={handleClickOutside}>
      <Box sx={{ minWidth: '300px' }}>
        <DialogTitle className={styles['dialog-title']}>Edit Category</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit} className={styles['category-form']}>
            <FormControl fullWidth className={styles['tournament-form-category']}>
              <Box component="label" sx={{ fontWeight: '500' }}>
                Category <span className={styles['required-marked']}>*</span>
              </Box>
              <Autocomplete
                disableClearable={formik?.values?.categoryId ? false : true}
                options={listCategory?.map((option: CategoryName) => option.categoryName)}
                onChange={(event, value) => {
                  formik.setFieldValue('categoryId', value)
                }}
                value={isOptionExists ? selectedValue : null}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: `${errorCategory && '#d32f2f'}`
                  },

                  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    borderColor: `${errorCategory && '#d32f2f'}`
                  },

                  '& .MuiOutlinedInput-root': {
                    padding: '2px'
                  }
                }}
                ListboxProps={{
                  style: {
                    maxHeight: '195px',
                    whiteSpace: 'pre-wrap'
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="category"
                    onChange={(event) => {
                      formik.handleChange(event)
                      handleInputChange(event, event.target.value)
                    }}
                    onBlur={handleBlurCategory}
                    error={
                      (selectedValue === '' || selectedValue === null) &&
                      errorCategory === false &&
                      formik.touched.categoryId &&
                      Boolean(formik.errors.categoryId)
                    }
                    helperText={
                      (selectedValue === '' || selectedValue === null) &&
                      errorCategory === false &&
                      formik.touched.categoryId &&
                      formik.errors.categoryId
                    }
                    variant="outlined"
                    className={styles['tournament-select-category']}
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
              {errorCategory && (selectedValue === '' || selectedValue === null) ? (
                <Box component="span" className={styles['category-error']}>
                  Category is required
                </Box>
              ) : null}
            </FormControl>
            <DialogActions className={styles['group-btn']}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button style={{ marginLeft: '12px' }} type="submit" variant="contained">
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Box>
    </Dialog>
  )
}

export default DiaLogEditCategoryInTournamnet
