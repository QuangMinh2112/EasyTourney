import * as Yup from 'yup'
import { email, password } from './common'

export const LoginSchema = Yup.object().shape({
  email,
  password
})
