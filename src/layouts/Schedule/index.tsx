import { Box, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ScheduleContent from './ScheduleContent/ScheduleContent'
import PlanSection from '../../components/Schedule/PlanSection/PlanSection'
import { useParams } from 'react-router-dom'
import { getTournamentById } from '../../apis/axios/tournaments/tournament'
import { setGeneral, setTeamsInSelectedTournament } from '../../redux/reducers/tournaments/tournaments.reducer'
import { useDispatch } from 'react-redux'
import { GeneralInformationAPIRes } from '../../types/common'
import { setPlanInformation, setTotalTeams } from '../../redux/reducers/schedule/schedule.reducer'
import { getAllTeamsInTournament } from '../../apis/axios/teams/team'

function Schedule() {
  const dispatch = useDispatch()
  const param: { tournamentId?: string } = useParams()
  const [update, setUpdate] = useState<boolean>(false)
  useEffect(() => {
    const fetchTournamentData = async () => {
      const response = (await getTournamentById(Number(param.tournamentId))) as GeneralInformationAPIRes
      if (response.additionalData?.tournamentPlan) {
        dispatch(
          setPlanInformation({
            duration: response.additionalData.tournamentPlan.matchDuration,
            betweenTime: response.additionalData.tournamentPlan.timeBetween,
            startTime: response.additionalData.tournamentPlan.startTimeDefault,
            endTime: response.additionalData.tournamentPlan.endTimeDefault
          })
        )
      } else {
        dispatch(
          setPlanInformation({
            duration: 0,
            betweenTime: 0,
            startTime: '',
            endTime: ''
          })
        )
      }
      const responseData = await getAllTeamsInTournament(Number(param.tournamentId))
      dispatch(setGeneral(response.data))
      dispatch(setTotalTeams(responseData.data?.length))
      dispatch(setTeamsInSelectedTournament(responseData.data))
    }
    if (param.tournamentId) {
      fetchTournamentData()
    }
  }, [param.tournamentId, update])

  return (
    <Box sx={{ marginTop: '2rem', overflowX: 'auto' }}>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <ScheduleContent isGenerated={update} />
        </Grid>
        <Grid item xs={3}>
          <PlanSection
            onGenerateSchedule={() => {
              setUpdate((prev) => !prev)
            }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Schedule
