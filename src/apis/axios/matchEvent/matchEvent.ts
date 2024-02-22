import { MatchEvent } from '../../../types/event'
import axios from '../../config/axios-config'

export async function addEvent(tournamentId: number, data: MatchEvent, eventDateId: number) {
  const res = await axios({
    url: `/tournament/${tournamentId}/event/` + eventDateId,
    method: 'POST',
    data
  })
  return res
}

export async function editEvent(tournamentId: number, data: MatchEvent, eventId: number) {
  const res = await axios({
    url: `/tournament/${tournamentId}/event/` + eventId,
    method: 'PUT',
    data
  })
  return res
}

export async function deleteEvent(tournamentId: number, eventId: number) {
  const res = await axios({
    url: `/tournament/${tournamentId}/event/` + eventId,
    method: 'DELETE'
  })
  return res
}
