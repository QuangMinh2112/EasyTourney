import { TournamentsEdit } from '../../../types/tournament'
import axios from '../../config/axios-config'

export async function editGeneralTournament(id: number, data: Partial<TournamentsEdit>) {
  const res = await axios({
    url: `/tournament/${id}/detail`,
    method: 'PUT',
    data: data
  })
  return res
}
export async function discardTournament(id: number) {
  const res = await axios({
    url: `/tournament/${id}/discard`,
    method: 'PUT'
  })
  return res
}
