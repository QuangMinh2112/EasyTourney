import axios from '../../config/axios-config'
import { ParamApi } from '../../../types/common'

export async function getAllTournaments(param: ParamApi) {
  const res = await axios({
    url: '/tournament',
    method: 'GET',
    params: param
  })
  return res
}

export async function deleteTournament(id: number) {
  const res = await axios({
    url: `/tournament/${id}`,
    method: 'DELETE'
  })
  return res
}

export async function getTournamentById(id: number) {
  const res = await axios({
    url: `/tournament/${id}`,
    method: 'GET'
  })
  return res
}
export async function createTournament(data: any) {
  const res = await axios({
    url: '/tournament',
    method: 'POST',
    data
  })
  return res
}
