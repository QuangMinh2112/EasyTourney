import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, Box } from '@mui/material'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { CategorySchema } from '../../../../services/validator/category.validator'
import { Categories } from '../../../../types/category'
import { useDispatch, useSelector } from 'react-redux'
import styles from './DialogEditCategory.module.css'
import { updateCategory } from '../../../../redux/reducers/categories/categories.reducer'

interface EditCategoryProps {
  editCategory: (categoryId: number, data: Categories) => Promise<any>
  categories: Categories[]
  onOpen: boolean
  onClose: () => void
  categoryName: string
}

export function DialogEditCategory({ editCategory, onOpen, onClose, categoryName }: EditCategoryProps) {
  const dispatch = useDispatch()
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [error, setError] = useState({
    categoryNameError: '',
    invalidError: ''
  })
  const selectedCategory = useSelector((state: any) => state.category.seletedCategory)

  const resetError = () => {
    setError({
      categoryNameError: '',
      invalidError: ''
    })
  }

  const formik = useFormik({
    initialValues: {
      categoryName: categoryName
    },
    validationSchema: CategorySchema,
    onSubmit: async () => {
      try {
        setIsSaving(true)
        const updatedCategoryName = {
          categoryId: selectedCategory.categoryId,
          categoryName: formik.values.categoryName.trim()
        }
        const response = await editCategory(selectedCategory.categoryId, updatedCategoryName)
        if (response.success) {
          const updatedCategory = response.data
          dispatch(updateCategory(updatedCategory))
          toast.success('A category is updated successfully!')
          handleClose()
        } else {
          setError({
            categoryNameError: response.errorMessage['categoryName'],
            invalidError: response.errorMessage['Invalid Error']
          })
        }
      } catch (error) {
        toast.error('An error occurred while updating the category!')
        handleClose()
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
        categoryName: categoryName
      })
    }
  }, [onOpen])

  const handleClose = () => {
    onClose()
  }

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      if (formik.isValid) {
        handleClose()
      }
    }
  }

  return (
    <Dialog open={onOpen} onClose={onClose} onClick={handleClickOutside}>
      <DialogTitle>Edit Category</DialogTitle>
      {error.invalidError && (
        <Alert className={styles['alert-message']} severity="error">
          {error.invalidError}
        </Alert>
      )}
      <form onSubmit={formik.handleSubmit} className={styles['category-form']}>
        <DialogContent>
          <Box component="label" sx={{ fontWeight: '500' }}>
            Category name <span className={styles['required-marked']}>*</span>
          </Box>
          <TextField
            fullWidth
            id="categoryName"
            name="categoryName"
            value={formik.values.categoryName}
            onChange={(value) => {
              error.categoryNameError = ''
              formik.handleChange(value)
            }}
            onBlur={formik.handleBlur}
            error={
              formik.touched.categoryName && (Boolean(error.categoryNameError) || Boolean(formik.errors.categoryName))
            }
            helperText={
              formik.touched.categoryName &&
              (error.categoryNameError ? error.categoryNameError : formik.errors.categoryName)
            }
          />
          <DialogActions className={styles['group-btn']}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button style={{ marginLeft: '12px' }} variant="contained" type="submit" disabled={isSaving}>
              Save
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
    </Dialog>
  )
}
