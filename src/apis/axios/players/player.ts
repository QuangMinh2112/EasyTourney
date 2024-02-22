import { Player } from '../../../types/player'
import axios from '../../config/axios-config'

export async function getAllPlayersInTeam(tournamentId: number, teamId: number) {
  const res = await axios({
    url: `/tournament/${tournamentId}/team/${teamId}/player`,
    method: 'GET'
  })
  return res
}

export async function addPlayer(tournamentId: number, teamId: number, data: Player) {
  const res = await axios({
    url: `/tournament/${tournamentId}/team/${teamId}/player`,
    method: 'POST',
    data
  })
  return res
}

export async function getPlayerById(tournamentId: number, teamId: number, playerId: number) {
  const res = await axios({
    url: `/tournament/${tournamentId}/team/${teamId}/player/${playerId}`,
    method: 'GET'
  })
  return res
}

export async function putPlayerById(tournamentId: number, teamId: number, data: Player) {
  const res = await axios({
    url: `/tournament/${tournamentId}/team/${teamId}/player/${data.playerId}`,
    method: 'PUT',
    data
  })
  return res
}

export async function deletePlayer(tournamentId: number, teamId: number, playerId: number) {
  const res = await axios({
    url: `/tournament/${tournamentId}/team/${teamId}/player/${playerId}`,
    method: 'DELETE'
  })
  return res
}
