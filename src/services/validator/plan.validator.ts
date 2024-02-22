import * as Yup from 'yup'
import { betweenTime, duration, endTime, startTime } from './common'

export const PlanInformationSchema = Yup.object().shape({
  duration,
  betweenTime,
  startTime,
  endTime
})
