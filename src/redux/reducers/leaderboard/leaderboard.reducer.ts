import { LeaderboardRecord } from './../../../types/leaderboard'
import { createSlice } from '@reduxjs/toolkit'

interface LeaderboardState {
  leaderboard: LeaderboardRecord
  isLoading: boolean
}

const initialState: LeaderboardState = {
  leaderboard: { started: false, teamsTop1: [], teamsTop2: [], teamsTop3: [], leaderBoard: [], matches: [] },
  isLoading: false
}

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: initialState,
  reducers: {
    setLeaderboard: (state, action) => {
      state.leaderboard = action.payload
    }
  }
})

export const { setLeaderboard } = leaderboardSlice.actions

export default leaderboardSlice.reducer
