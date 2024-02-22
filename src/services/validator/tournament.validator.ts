import * as Yup from 'yup'
import { title, description } from './common'

export const TournamentSchema = Yup.object().shape({
  title,
  description
})
