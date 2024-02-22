export const mockDataBoardSchedule = {
  columns: [
    //Column1
    {
      eventDateId: 1,
      startTime: '08:00:00',
      endTime: '13:00:00',
      date: '31/12/2023',
      // cardOrderIds: ['card-id-01', 'card-id-02'],
      matches: [
        {
          id: 'card-id-01',
          evendateId: 1,
          teamOne: {
            teamId: 1,
            teamName: 'MU',
            tournamentId: 1,
            score: 2,
            updatedAt: null,
            createdAt: null
          },
          teamTwo: {
            teamId: 5,
            teamName: 'Chels',
            tournamentId: 1,
            score: 1,
            updatedAt: null,
            createdAt: null
          },
          teamOneResult: null,
          teamTwoResult: null,
          startTime: '08:00:00',
          endTime: '09:00:00',
          title: null,
          type: 'MATCH'
        },
        {
          id: 'card-id-02',
          evendateId: 1,
          teamOne: {
            teamId: 2,
            teamName: 'MC',
            tournamentId: 1,
            score: 2,
            updatedAt: null,
            createdAt: null
          },
          teamTwo: {
            teamId: 6,
            teamName: 'Tot',
            tournamentId: 1,
            score: null,
            updatedAt: null,
            createdAt: null
          },
          teamOneResult: null,
          teamTwoResult: null,
          startTime: '09:05:00',
          endTime: '10:00:00',
          title: null,
          type: 'MATCH'
        }
      ]
    },
    //column2
    {
      eventDateId: 2,
      startTime: '10:00:00',
      endTime: '13:00:00',
      date: '31/12/2023',
      // cardOrderIds: ['card-id-01', 'card-id-02'],
      matches: [
        {
          id: 'card-id-03',
          evendateId: 2,
          teamOne: {
            teamId: 7,
            teamName: 'team1',
            tournamentId: 1,
            score: 2,
            updatedAt: null,
            createdAt: null
          },
          teamTwo: {
            teamId: 3,
            teamName: 'team2',
            tournamentId: 1,
            score: 1,
            updatedAt: null,
            createdAt: null
          },
          teamOneResult: null,
          teamTwoResult: null,
          startTime: '08:00:00',
          endTime: '09:00:00',
          title: null,
          type: 'MATCH'
        },
        {
          id: 'card-id-04',
          evendateId: 2,
          teamOne: {
            teamId: 9,
            teamName: 'team4',
            tournamentId: 1,
            score: 2,
            updatedAt: null,
            createdAt: null
          },
          teamTwo: {
            teamId: 10,
            teamName: 'team5',
            tournamentId: 1,
            score: null,
            updatedAt: null,
            createdAt: null
          },
          teamOneResult: null,
          teamTwoResult: null,
          startTime: '09:05:00',
          endTime: '10:00:00',
          title: null,
          type: 'MATCH'
        },
        {
          id: 'card-id-05',
          evendateId: 2,
          teamOne: {
            teamId: 9,
            teamName: 'team6',
            tournamentId: 1,
            score: 2,
            updatedAt: null,
            createdAt: null
          },
          teamTwo: {
            teamId: 10,
            teamName: 'team7',
            tournamentId: 1,
            score: null,
            updatedAt: null,
            createdAt: null
          },
          teamOneResult: null,
          teamTwoResult: null,
          startTime: '09:30:00',
          endTime: '10:30:00',
          title: null,
          type: 'MATCH'
        }
      ]
    },
    // column empty
    {
      eventDateId: 3,
      startTime: '17:00:00',
      endTime: '22:00:00',
      date: '22/2/2023',
      // cardOrderIds: ['column-id-04-placeholder-card'],
      matches: [
        {
          id: '3-placeholder-card',
          eventDateId: 3,
          FE_PlaceholderCard: true
        }
      ]
    }
  ]
}
