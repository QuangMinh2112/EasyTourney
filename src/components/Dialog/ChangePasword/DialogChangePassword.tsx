import { useState } from 'react'
import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { Box, Stack } from '@mui/system'
import styles from './DialogChangePassword.module.css'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { changePassword } from '../../../apis/axios/auth/login'
import { ChangePasswordAPIRes } from '../../../types/common'
import { Alert, IconButton, InputAdornment } from '@mui/material'
import { ChangePasswordSchema } from '../../../services/validator/changePassword'
import { Visibility, VisibilityOff } from '@mui/icons-material'

interface TournamentTitleProps {
  open: boolean
  setOpen: (value: boolean) => void
}
const DialogChangePassword = ({ open, setOpen }: TournamentTitleProps) => {
  const [error, setError] = useState<string>()
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleClose = () => {
    setOpen(false)
    formik.resetForm()
    setError('')
    setShowOldPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
  }
  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: ChangePasswordSchema,
    onSubmit: async (values) => {
      try {
        const response = (await changePassword(values)) as ChangePasswordAPIRes
        if (response.success) {
          toast.success('Password changed successfully!')
          handleClose()
        } else {
          setError(response?.errorMessage['Invalid Error'])
        }
      } catch (error) {
        console.error('Error:', error)
        toast.error('An error occurred while changing the password.')
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
  const handleToggleOldPassword = () => {
    setShowOldPassword((showPassword) => !showPassword)
  }
  const handleToggleNewPasswordVisibility = () => {
    setShowNewPassword((showPassword) => !showPassword)
  }
  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((showPassword) => !showPassword)
  }
  return (
    <Dialog open={open} onClose={handleClose} onClick={handleClickOutside}>
      <DialogTitle>Change Password</DialogTitle>
      {error && (
        <Alert className={styles['alert-message']} severity="error">
          {error}
        </Alert>
      )}
      <DialogContent>
        <form onSubmit={formik.handleSubmit} className={styles['changepassword-form']}>
          <Stack>
            <Box component="label" sx={{ fontWeight: '500' }}>
              Old Password <span className={styles['required-marked']}>*</span>
            </Box>
            <TextField
              id="oldPassword"
              name="oldPassword"
              value={formik.values.oldPassword}
              margin="dense"
              fullWidth
              type={showOldPassword ? 'text' : 'password'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
              helperText={
                formik.touched.oldPassword && typeof formik.errors.oldPassword === 'string'
                  ? formik.errors.oldPassword
                  : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleOldPassword}>
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Stack>
          <Stack>
            <Box component="label" sx={{ fontWeight: '500' }}>
              New Password <span className={styles['required-marked']}>*</span>
            </Box>
            <TextField
              id="newPassword"
              name="newPassword"
              value={formik.values.newPassword}
              margin="dense"
              fullWidth
              type={showNewPassword ? 'text' : 'password'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
              helperText={
                formik.touched.newPassword && typeof formik.errors.newPassword === 'string'
                  ? formik.errors.newPassword
                  : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleNewPasswordVisibility}>
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Stack>
          <Stack>
            <Box component="label" sx={{ fontWeight: '500' }}>
              Confirm Password <span className={styles['required-marked']}>*</span>
            </Box>
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              margin="dense"
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={
                formik.touched.confirmPassword && typeof formik.errors.confirmPassword === 'string'
                  ? formik.errors.confirmPassword
                  : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleConfirmPasswordVisibility}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Stack>
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
  )
}

export default DialogChangePassword
