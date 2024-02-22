import * as Yup from 'yup'
import { firstName, lastName, email, phoneNumber, dateOfBirth } from './common'

export const OrganizerSchema = Yup.object().shape({
  firstName,
  lastName,
  email,
  phoneNumber,
  dateOfBirth
})
