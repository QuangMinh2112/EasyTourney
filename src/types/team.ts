export interface Team {
  teamId: number
  teamName: string
  playerCount: number
}

export interface TeamOfMatch {
  updatedAt: string | null
  createdAt: string | null
  score: number | null
  teamId: number
  teamName: string
  tournamentId: number
}
