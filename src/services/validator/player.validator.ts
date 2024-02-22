import * as Yup from 'yup'
import { playerName, dateOfBirth, phone } from './common'

export const PlayerSchema = Yup.object().shape({
  playerName,
  dateOfBirth,
  phone
})
