import { DragDropData } from '../../../types/schedule.type'
import { PlanInformation } from '../../../types/plan'
import axios from '../../config/axios-config'

export async function getAllScheduledMatches(id: number) {
  const res = await axios({
    url: `/generate/${id}`,
    method: 'GET'
  })
  return res
}

export async function dragDropApi(id: number, data: DragDropData) {
  const res = await axios({
    url: `/tournament/${id}/match/dragAndDrop`,
    method: 'PUT',
    data
  })
  return res
}

export async function EditEventTimeApi(idTournament: number, data: any, eventDateId: number) {
  const res = await axios({
    url: `/tournament/${idTournament}/eventDate/${eventDateId}`,
    method: 'PUT',
    data
  })
  return res
}

export async function generateSchedule(tournamentId: number, data: PlanInformation) {
  const res = await axios({
    url: `/generate/${tournamentId}`,
    method: 'POST',
    data
  })
  return res
}

export async function editMatchApi(tournamentId: number, matchId: number, data: any) {
  const res = await axios({
    url: `/tournament/${tournamentId}/match/${matchId}`,
    method: 'PUT',
    data
  })
  return res
}
