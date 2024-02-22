import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import styles from './DialogAddOrganizer.module.css'
import { OrganizerSchema } from '../../../../services/validator/organizer.validator'
import { DatePicker } from '@mui/x-date-pickers'
import { Organizer } from '../../../../types/organizer'
import dayjs from 'dayjs'
import { AddCircle } from '@mui/icons-material'

interface DialogAddOrganizerProps {
  addOrganizer: (data: Organizer) => Promise<any>
  onAdd: () => void
}

const DialogAddOrganizer = ({ addOrganizer, onAdd }: DialogAddOrganizerProps) => {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [error, setError] = useState({
    firstNameError: '',
    lastNameError: '',
    emailError: '',
    phoneNumberError: '',
    dateOfBirthError: '',
    invalidError: ''
  })

  const resetError = () => {
    setError({
      firstNameError: '',
      lastNameError: '',
      emailError: '',
      phoneNumberError: '',
      dateOfBirthError: '',
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
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: null
    },
    validationSchema: OrganizerSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        setIsSaving(true)
        const organizerData = {
          id: 0,
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          phoneNumber: values.phoneNumber.trim(),
          dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : undefined
        }
        const response = await addOrganizer(organizerData)

        if (response.success) {
          onAdd()
          toast.success('An organizer is created successfully!')
          handleClose()
        } else {
          setError({
            firstNameError: response.errorMessage['firstName'],
            lastNameError: response.errorMessage['lastName'],
            emailError: response.errorMessage['email'],
            phoneNumberError: response.errorMessage['phoneNumber'],
            dateOfBirthError: response.errorMessage['dateOfBirth'],
            invalidError: response.errorMessage['Invalid Error']
          })
        }
      } catch (error) {
        toast.error('An error occurred while adding new organizer!')
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
    <Box sx={{ textAlign: 'center', paddingTop: '1rem' }}>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        style={{
          background: 'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))',
          color: 'white'
        }}
        endIcon={<AddCircle />}
      >
        Add new
      </Button>
      <Dialog onClick={handleClickOutside} onClose={handleClose} open={open}>
        <DialogTitle className={styles['dialog-title']}>Create Organizer</DialogTitle>
        {error.invalidError && (
          <Alert className={styles['alert-message']} severity="error">
            {error.invalidError}
          </Alert>
        )}
        <DialogContent>
          <form onSubmit={formik.handleSubmit} className={styles['organizer-form']}>
            <Stack>
              <Box component="label" sx={{ fontWeight: '500' }}>
                First name <span className={styles['required-marked']}>*</span>
              </Box>
              <TextField
                fullWidth
                value={formik.values.firstName}
                id="firstName"
                name="firstName"
                onBlur={formik.handleBlur}
                onChange={(value) => {
                  error.firstNameError = ''
                  formik.handleChange(value)
                }}
                error={formik.touched.firstName && (Boolean(error.firstNameError) || Boolean(formik.errors.firstName))}
                helperText={
                  formik.touched.firstName && (error.firstNameError ? error.firstNameError : formik.errors.firstName)
                }
              />
            </Stack>
            <Stack>
              <Box component="label" sx={{ fontWeight: '500' }}>
                Last name <span className={styles['required-marked']}>*</span>
              </Box>
              <TextField
                fullWidth
                value={formik.values.lastName}
                id="lastName"
                name="lastName"
                onBlur={formik.handleBlur}
                onChange={(value) => {
                  error.lastNameError = ''
                  formik.handleChange(value)
                }}
                error={formik.touched.lastName && (Boolean(error.lastNameError) || Boolean(formik.errors.lastName))}
                helperText={
                  formik.touched.lastName && (error.lastNameError ? error.lastNameError : formik.errors.lastName)
                }
              />
            </Stack>
            <Stack>
              <Box component="label" sx={{ fontWeight: '500' }}>
                Email <span className={styles['required-marked']}>*</span>
              </Box>
              <TextField
                fullWidth
                value={formik.values.email}
                id="email"
                name="email"
                onBlur={formik.handleBlur}
                onChange={(value) => {
                  error.emailError = ''
                  formik.handleChange(value)
                }}
                error={formik.touched.email && (Boolean(error.emailError) || Boolean(formik.errors.email))}
                helperText={formik.touched.email && (error.emailError ? error.emailError : formik.errors.email)}
              />
            </Stack>
            <Stack>
              <Box component="label" sx={{ fontWeight: '500' }}>
                Phone number <span className={styles['required-marked']}>*</span>
              </Box>
              <TextField
                fullWidth
                value={formik.values.phoneNumber}
                id="phoneNumber"
                name="phoneNumber"
                onBlur={formik.handleBlur}
                onChange={(value) => {
                  error.phoneNumberError = ''
                  formik.handleChange(value)
                }}
                error={
                  formik.touched.phoneNumber && (Boolean(error.phoneNumberError) || Boolean(formik.errors.phoneNumber))
                }
                helperText={
                  formik.touched.phoneNumber &&
                  (error.phoneNumberError ? error.phoneNumberError : formik.errors.phoneNumber)
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

export { DialogAddOrganizer }
