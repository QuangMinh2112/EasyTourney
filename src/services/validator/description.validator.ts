import * as Yup from 'yup'
import { description } from './common'

export const DescriptionSchema = Yup.object().shape({
  description
})
