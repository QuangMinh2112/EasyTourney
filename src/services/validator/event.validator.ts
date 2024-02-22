import * as Yup from 'yup'
import { title, durationEvent } from './common'

export const EventSchema = Yup.object().shape({
  title,
  durationEvent
})
