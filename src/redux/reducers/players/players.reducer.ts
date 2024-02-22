import { createSlice } from '@reduxjs/toolkit'
import { Player, PlayerRecord } from '../../../types/player'

interface PlayerState {
  players: PlayerRecord[]
  isLoading: boolean
  selectedTeamId: number
  selectedPlayer: Player | null
}

const initialState: PlayerState = {
  players: [],
  isLoading: false,
  selectedTeamId: -1,
  selectedPlayer: null
}

const playersSlice = createSlice({
  name: 'players',
  initialState: initialState,
  reducers: {
    setPlayers: (state, action) => {
      state.players = [...action.payload]
    },
    setSelectedTeamId: (state, action) => {
      state.selectedTeamId = action.payload
    },
    setSelectedPlayer: (state, action) => {
      state.selectedPlayer = action.payload
    },
    updatePlayer: (state, action) => {
      const player = action.payload
      const index = state.players.findIndex((p) => p.playerId === player.playerId)
      if (index !== -1) {
        state.players[index].playerName = player.playerName
        state.players[index].dateOfBirth = player.dateOfBirth
        state.players[index].phone = player.phone
      }
    }
  }
})

export const { setPlayers, setSelectedTeamId, setSelectedPlayer, updatePlayer } = playersSlice.actions

export default playersSlice.reducer
