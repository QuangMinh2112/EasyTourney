import { createSlice } from '@reduxjs/toolkit'
import { Tournament, TournamentRecord } from '../../../types/tournament'
import { TeamOfMatch } from '../../../types/team'

interface TournamentState {
  tournaments: TournamentRecord[]
  isLoading: boolean
  general: Tournament
  teams: TeamOfMatch[]
}

const initialState: TournamentState = {
  tournaments: [],
  isLoading: false,
  general: {
    id: 0,
    title: '',
    description: '',
    category: {
      categoryId: 0,
      categoryName: ''
    },
    organizers: [],
    eventDates: [],
    createdAt: '',
    status: '',
    format: '',
    matchDuration: ''
  },
  teams: []
}

const tournamentsSlice = createSlice({
  name: 'tournaments',
  initialState: initialState,
  reducers: {
    setTournaments: (state, action) => {
      state.tournaments = [...action.payload]
    },
    setGeneral: (state, action) => {
      state.general = action.payload
    },
    setTeamsInSelectedTournament: (state, action) => {
      state.teams = [...action.payload]
    },
    updatedOrganizer: (state, action) => {
      state.general.organizers = action.payload
    },
    updatedEventDate: (state, action) => {
      state.general.eventDates = action.payload
    }
  }
})

export const { setTournaments, setGeneral, setTeamsInSelectedTournament, updatedOrganizer, updatedEventDate } =
  tournamentsSlice.actions

export default tournamentsSlice.reducer
