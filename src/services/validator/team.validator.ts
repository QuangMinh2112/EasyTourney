import * as Yup from 'yup'
import { teamName } from './common'

export const TeamSchema = Yup.object().shape({
  teamName
})
