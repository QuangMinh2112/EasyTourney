export interface OrganizerRecord {
  id: number
  fullName: string
  email: string
  phoneNumber?: string
  dateOfBirth?: string
  totalTournament: number
  createdAt: string
}

export interface Organizer {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  dateOfBirth?: string
}
