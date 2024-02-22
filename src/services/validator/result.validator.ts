import * as Yup from 'yup'
import { teamOneResult, teamTwoResult } from './common'

export const ResultSchema = Yup.object().shape({
  teamOneResult,
  teamTwoResult
})
