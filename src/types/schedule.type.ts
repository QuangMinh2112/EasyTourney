export interface TeamDataType {
  teamId: number
  teamName: string
  tournamentId: number
  score: number | null
  updatedAt: string | null
  createdAt: string | null
}
export interface MatchDataDuplicate {
  endTime: string
  eventDateId: number
  id: number
  matchDuration: number
  startTime: string
  teamOneId: number
  teamOneResult: number | null
  teamTwoId: number
  teamTwoResult: number | null
  title: string | null
  type: string
}
export interface TimeNotEnough {
  warningMessage: string
  eventDateId: number[]
}

export interface MatchDataType {
  id: string | number
  teamOne: TeamDataType
  teamTwo: TeamDataType
  teamOneResult: string | null
  teamTwoResult: string | null
  startTime: string
  endTime: string
  eventDateId: number
  title: string | null
  type: string
  timeDuration: number
  FE_PlaceholderCard?: boolean
}
export interface ScheduleDataType {
  eventDateId: number
  startTime: string
  endTime: string
  date: string
  matches: MatchDataType[]
}

export interface DragDropData {
  matchId: number
  newEventDateId: number
  newIndexOfMatch: number
}

export interface TimeEvent {
  date: string
  id: number
  tournamentId: number
  endTime: string
  startTime: string
  updatedAt: string | null
  createdAt: string | null
}
