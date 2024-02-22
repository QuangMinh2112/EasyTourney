import * as Yup from 'yup'
import { categoryName } from './common'

export const CategorySchema = Yup.object().shape({
  categoryName
})
