import { AxiosResponse } from 'axios'
import { Categories } from './category'
import { Organizer, OrganizerRecord } from './organizer'
import { Tournament } from './tournament'
import { Team, TeamOfMatch } from './team'
import { Player } from './player'
import { MatchDataDuplicate, ScheduleDataType, TimeEvent, TimeNotEnough } from './schedule.type'
import { MatchEvent } from './event'

export interface APIRes extends AxiosResponse {
  success: boolean
  data: Categories[]
  total: number
  additionalData: {
    totalCategories: number
  }
  message: string
  errorMessage?: unknown
}

export interface OrganizerAPIRes extends AxiosResponse {
  success: boolean
  data: OrganizerRecord[]
  total: number
  additionalData: {
    totalOrganizer: number
  }
  message: string
}

export interface OrganizerByIdAPIRes extends AxiosResponse {
  success: boolean
  data: Organizer
  message: string
}

export interface TournamentAPIRes extends AxiosResponse {
  success: boolean
  data: Tournament[]
  total: number
  additionalData: {
    totalTournament: number
  }
  message: string
  errorMessage?: unknown
}

export interface PlayerAPIRes extends AxiosResponse {
  success: boolean
  data: Player[]
  total: number
  message: string
  errorMessage?: unknown
}

export interface PlayerByIdAPIRes extends AxiosResponse {
  success: boolean
  data: Player
  message: string
  errorMessage?: unknown
}

export interface TeamAPIRes extends AxiosResponse {
  success: boolean
  data: Team[]
  total: number
  additionalData: {
    totalTeamOfTournament: number
  }
  message: string
}

export interface TeamByIdAPIRes extends AxiosResponse {
  success: boolean
  data: Team
  message: string
}

export interface EventAPIRes extends AxiosResponse {
  success: boolean
  data: MatchEvent
  message: string
  errorMessage?: unknown
}

export interface ColumnTypes {
  id: string
  sortTable?: boolean
  label: string
  left?: boolean
  sortBy?: string
  style?: {
    filed: string
    width: string
  }
}
export interface ParamApi {
  sortType?: string
  page?: number
  size?: number
  keyword?: string
  sortValue?: string
  filterStatus?: string
  filterCategory?: string
  id?: number
}

export interface ScheduleMatchesAPIRes extends AxiosResponse {
  success: boolean
  data: ScheduleDataType[]
  total: number
  additionalData: {
    DuplicateMatch: MatchDataDuplicate[]
    TimeNoEnough: TimeNotEnough
  } | null
  errorMessage: { [key: string]: string }
}
export interface ScheduleTimeEventAPIRes extends AxiosResponse {
  success: boolean
  data: TimeEvent[]
  total: number
  additionalData: {
    totalOrganizer: number
  } | null
  errorMessage: { [key: string]: string }
}

export interface GeneralInformationAPIRes extends AxiosResponse {
  success: boolean
  data: any
  total: number
  additionalData: {
    tournamentPlan: any
  } | null
  errorMessage: { [key: string]: string }
}

export interface CommonAPIRes extends AxiosResponse {
  success: boolean
  data: any
  total: number
  additionalData: any
  errorMessage: { [key: string]: string }
}
export interface TeamsOfMatchAPIRes extends AxiosResponse {
  success: boolean
  data: TeamOfMatch[]
  total: number
  additionalData: {
    totalTeamOfTournament: number
  }
  message: string
}

export interface EditMatchAPIRes extends AxiosResponse {
  success: boolean
  data: any
  total: number
  additionalData: {
    totalOrganizer: number
  } | null
  errorMessage: { [key: string]: string }
}

export interface ChangePasswordAPIRes extends AxiosResponse {
  success: boolean
  data: any
  total: number
  additionalData: any
  errorMessage: { [key: string]: string }
}

export interface GeneralTournamentAPIRes extends AxiosResponse {
  success: boolean
  data: any
  total: number
  additionalData: any
  errorMessage: { [key: string]: string }
}
