export interface Result {
  id: number
  teamOneId: number
  teamTwoId: number
  teamOneResult: number
  teamTwoResult: number
  startTime: Date
  endTime: Date
}

export interface Matches {
  matches: Result[]
}
