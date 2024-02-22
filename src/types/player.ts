export interface PlayerRecord {
  playerId: number
  playerName: string
  dateOfBirth?: string
  phone?: string
}
export interface Player {
  playerId: number
  playerName: string
  teamId: number
  dateOfBirth?: string
  phone?: string
  createdAt?: string
  updatedAt?: string
}
