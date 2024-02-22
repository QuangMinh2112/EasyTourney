import * as Yup from 'yup'
import { oldPassword, newPassword, confirmPassword } from './common'

export const ChangePasswordSchema = Yup.object().shape({
  oldPassword,
  newPassword,
  confirmPassword
})
