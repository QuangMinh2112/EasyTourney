import { Categories } from './category'
import { EventDate } from './eventDate'
import { Organizer } from './organizer'

export interface Tournament {
  id: number
  title: string
  description: string
  category: Categories
  organizers: Organizer[]
  eventDates: EventDate[]
  createdAt: string
  status: string
  format?: string
  matchDuration?: string
}

export interface TournamentRecord {
  id: string
  title: string
  category: string
  organizers: string
  eventDates: string
  createdAt: string
  status: string
}

export interface TournamentsEdit {
  id: number
  title?: string
  description?: string
  categoryId: string
  organizers?: number[]
  eventDates?: number[]
}
