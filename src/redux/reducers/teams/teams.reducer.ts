import { createSlice } from '@reduxjs/toolkit'
import { Team } from '../../../types/team'

interface TeamState {
  teams: Team[]
  isLoading: boolean
  selectedTeam: Team | null
}

const initialState: TeamState = {
  teams: [],
  isLoading: false,
  selectedTeam: null
}

const teamsSlice = createSlice({
  name: 'teams',
  initialState: initialState,
  reducers: {
    setTeams: (state, action) => {
      state.teams = [...action.payload]
    },
    setSelectedTeam: (state, action) => {
      state.selectedTeam = action.payload
    },
    updateTeams: (state, action) => {
      const updatedTeam = action.payload
      const index = state.teams.findIndex((team) => team.teamId === updatedTeam.teamId)
      if (index !== -1) {
        state.teams[index].teamName = updatedTeam.teamName
      }
    }
  }
})

export const { setTeams, setSelectedTeam, updateTeams } = teamsSlice.actions

export default teamsSlice.reducer
