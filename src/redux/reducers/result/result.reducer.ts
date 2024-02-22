import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Matches } from '../../../types/result'

interface ResultsState {
  resultMatch: Matches[]
  selectedGoal: {
    goalsA: number
    goalsB: number
  }
}

const initialState: ResultsState = {
  resultMatch: [],
  selectedGoal: {
    goalsA: 0,
    goalsB: 0
  }
}

const resultsSlice = createSlice({
  name: 'results',
  initialState: initialState,
  reducers: {
    setResult: (state, action) => {
      state.resultMatch = action.payload
    },
    setSelectedGoal: (state, action) => {
      state.selectedGoal = action.payload
    },
    updateResult: (state, action: PayloadAction<{ matchId: number; teamOneResult: number; teamTwoResult: number }>) => {
      const matchToUpdate = state.resultMatch
        .flatMap((day) => day.matches)
        .find((match) => match.id === action.payload.matchId)

      if (matchToUpdate) {
        matchToUpdate.teamOneResult = action.payload.teamOneResult
        matchToUpdate.teamTwoResult = action.payload.teamTwoResult
      }
    }
  }
})

export const { setResult, setSelectedGoal, updateResult } = resultsSlice.actions

export default resultsSlice.reducer
