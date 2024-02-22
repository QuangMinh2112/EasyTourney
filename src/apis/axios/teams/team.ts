import axios from '../../config/axios-config'
import { ParamApi } from '../../../types/common'
import { Team } from '../../../types/team'

export async function getAllTeam(param: ParamApi, tournamentId: number) {
  const res = await axios({
    url: '/tournament/' + tournamentId + '/team',
    method: 'GET',
    params: param
  })
  return res
}

export async function deleteTeam(id: number, tournamentId: number) {
  const res = await axios({
    url: '/tournament/' + tournamentId + `/team/${id}`,
    method: 'DELETE'
  })
  return res
}

export async function addTeam(data: Team, tournamentId: number) {
  const res = await axios({
    url: '/tournament/' + tournamentId + '/team',
    method: 'POST',
    data
  })
  return res
}

export async function getTeamById(id: number, tournamentId: number) {
  const res = await axios({
    url: '/tournament/' + tournamentId + `/team/${id}`,
    method: 'GET'
  })
  return res
}

export async function putTeamById(data: Team, tournamentId: number) {
  const res = await axios({
    url: '/tournament/' + tournamentId + `/team/${data.teamId}`,
    method: 'PUT',
    data: data
  })
  return res
}

export async function getAllTeamsInTournament(tournamentId: number) {
  const res = await axios({
    url: '/tournament/' + tournamentId + '/team/all',
    method: 'GET'
  })
  return res
}
