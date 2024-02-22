import * as Yup from 'yup'
import { startTimeEventDate, endTimeEventDate, duration, teamOne, teamTwo } from './common'

export const ScheduleSchema = Yup.object().shape({
  startTimeEventDate,
  endTimeEventDate
})

export const ScheduleSchemaEditMatch = Yup.object().shape({
  duration,
  teamOne,
  teamTwo
})
