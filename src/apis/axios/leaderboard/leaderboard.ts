import axios from '../../config/axios-config'

export async function getLeaderboard(tournamentId: number) {
  const res = await axios({
    url: `/tournament/${tournamentId}/leaderboard`,
    method: 'GET'
  })
  return res
}
