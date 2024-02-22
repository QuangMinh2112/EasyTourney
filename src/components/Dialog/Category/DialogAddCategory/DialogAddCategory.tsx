import React, { useState } from 'react'
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { CategorySchema } from '../../../../services/validator/category.validator'
import { CategoryName } from '../../../../types/category'
import styles from './DialogAddCategory.module.css'
import { AddCircle } from '@mui/icons-material'
interface DialogAddCategoryProps {
  addCategory: (data: CategoryName) => Promise<any>
  onAdd: () => void
}

export function DialogAddCategory({ addCategory, onAdd }: DialogAddCategoryProps) {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [error, setError] = useState({
    categoryNameError: '',
    invalidError: ''
  })
  const [open, setOpen] = useState<boolean>(false)

  const resetError = () => {
    setError({
      categoryNameError: '',
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
      categoryName: ''
    },
    validationSchema: CategorySchema,
    onSubmit: async (values) => {
      try {
        setIsSaving(true)
        const categoryData = {
          categoryId: 0,
          categoryName: values.categoryName.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: null,
          deletedAt: null,
          deleted: false
        }
        const response = await addCategory(categoryData)

        if (response.success) {
          onAdd()
          toast.success('A category is created successfully!')
          handleClose()
        } else {
          setError({
            categoryNameError: response.errorMessage['categoryName'],
            invalidError: response.errorMessage['Invalid Error']
          })
        }
      } catch (error) {
        toast.error('An error occurred while creating the category!')
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
    <Box sx={{ textAlign: 'center', paddingTop: '1rem' }}>
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
      <Dialog open={open} onClose={handleClose} onClick={handleClickOutside}>
        <DialogTitle>Create Category</DialogTitle>
        {error.invalidError && (
          <Alert className={styles['alert-message']} severity="error">
            {error.invalidError}
          </Alert>
        )}
        <DialogContent>
          <form onSubmit={formik.handleSubmit} className={styles['category-form']}>
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
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
