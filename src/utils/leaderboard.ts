import { LeaderboardRecord } from '../types/leaderboard'

export const convertLeaderboardRecord = (original: LeaderboardRecord): LeaderboardRecord => {
  if (original.leaderBoard.length !== 0 && original.leaderBoard[0].rank === 1 && original.leaderBoard[0].score !== 0) {
    original.started = true
  } else {
    original.started = false
  }
  original.teamsTop1 = []
  original.teamsTop2 = []
  original.teamsTop3 = []
  for (const team of original.leaderBoard) {
    if (team.score === null) {
      team.score = 0
    }
    if (team.theDifference === null) {
      team.theDifference = 0
    }
    if (team.totalResult === null) {
      team.totalResult = 0
    }
    team.negativeResult = team.totalResult - team.theDifference
    if (original.started) {
      if (team.rank === 1) {
        original.teamsTop1.push(team)
      } else if (team.rank === 2) {
        original.teamsTop2.push(team)
      } else if (team.rank === 3) {
        original.teamsTop3.push(team)
      }
    }
    const matchList = []
    for (const match of original.matches) {
      if ((match.teamOneId === team.teamId || match.teamTwoId === team.teamId) && match.teamWinId !== -1) {
        matchList.push(match)
      }
    }
    team.playedMatch = matchList.length
    if (matchList.length < 5) {
      while (matchList.length < 5) {
        matchList.push({
          matchId: -1,
          teamOneId: -1,
          teamOneName: '',
          teamTwoId: -1,
          teamTwoName: '',
          teamOneResult: -1,
          teamTwoResult: -1,
          date: '',
          startTime: '',
          endTime: '',
          teamWinId: -1
        })
      }
    } else if (matchList.length > 5) {
      matchList.splice(5)
    }
    team.last5 = matchList
  }

  return {
    started: original.started,
    teamsTop1: original.teamsTop1,
    teamsTop2: original.teamsTop2,
    teamsTop3: original.teamsTop3,
    leaderBoard: original.leaderBoard,
    matches: original.matches
  }
}
