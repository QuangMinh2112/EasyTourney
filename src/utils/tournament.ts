import dayjs from 'dayjs'
import { Tournament, TournamentRecord } from '../types/tournament'

export const convertTournament = (original: Tournament): TournamentRecord => {
  const fullName = []
  const eventDateArray = []
  for (const organizer of original.organizers) {
    fullName.push(organizer.firstName + ' ' + organizer.lastName)
  }
  for (const eventDate of original.eventDates) {
    const onDate = dayjs(new Date(eventDate.date)).format('DD/MM/YYYY')
    eventDateArray.push(onDate)
  }

  return {
    id: original.id.toString(),
    title: original.title,
    category: original.category.categoryName,
    organizers: fullName.join('; '),
    eventDates: eventDateArray.join('; '),
    createdAt: dayjs(new Date(original.createdAt)).format('DD/MM/YYYY hh:mm:ss A'),
    status: original.status
  }
}
