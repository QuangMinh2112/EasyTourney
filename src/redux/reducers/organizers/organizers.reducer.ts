import { createSlice } from '@reduxjs/toolkit'
import { Organizer, OrganizerRecord } from '../../../types/organizer'

interface OrganizerState {
  organizers: OrganizerRecord[]
  isLoading: boolean
  selectedOrganizer: Organizer | null
  selectOrganizers: []
}

const initialState: OrganizerState = {
  organizers: [],
  isLoading: false,
  selectedOrganizer: null,
  selectOrganizers: []
}

const organizersSlice = createSlice({
  name: 'organizers',
  initialState: initialState,
  reducers: {
    setOrganizer: (state, action) => {
      state.organizers = [...action.payload]
    },
    setSelectedOrganizer: (state, action) => {
      state.selectedOrganizer = action.payload
    },
    updateOrganizer: (state, action) => {
      const updatedOrganizer = action.payload
      const index = state.organizers.findIndex((organizer) => organizer.id === updatedOrganizer.id)
      if (index !== -1) {
        state.organizers[index].fullName = updatedOrganizer.fullName
        state.organizers[index].email = updatedOrganizer.email
        state.organizers[index].phoneNumber = updatedOrganizer.phoneNumber
        state.organizers[index].dateOfBirth = updatedOrganizer.dateOfBirth
      }
    },
    setSelectOrganizer: (state, action) => {
      state.selectOrganizers = action.payload
    }
  }
})

export const { setOrganizer, setSelectedOrganizer, updateOrganizer, setSelectOrganizer } = organizersSlice.actions

export default organizersSlice.reducer
