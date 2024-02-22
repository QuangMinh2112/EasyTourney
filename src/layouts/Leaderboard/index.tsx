import React, { useRef } from 'react'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getLeaderboard } from '../../apis/axios/leaderboard/leaderboard'
import { useDispatch, useSelector } from 'react-redux'
import { setLeaderboard } from '../../redux/reducers/leaderboard/leaderboard.reducer'
import { RootState } from '../../redux/store'
import { convertLeaderboardRecord } from '../../utils/leaderboard'
import styles from './Leaderboard.module.css'

import { getTournamentById } from '../../apis/axios/tournaments/tournament'
import { setGeneral } from '../../redux/reducers/tournaments/tournaments.reducer'
import { FinalResultSection } from './FinalResultSection/FinalResultSection'
import { LeaderboardTable } from './LeaderboardTable/LeaderboardTable'

const Leaderboard = () => {
  const [loading, setIsLoading] = useState<boolean>(true)
  const dispatch = useDispatch()
  const leaderboardData = useSelector((state: RootState) => state.leaderboard.leaderboard)
  const param: { tournamentId?: string } = useParams()
  const isInitialized = useRef(false)

  const getAll = async (tournamentId: number) => {
    if (!isInitialized.current) {
      const leaderboardResponse = await getLeaderboard(tournamentId)

      if (leaderboardResponse.data) {
        const convertedData = convertLeaderboardRecord(leaderboardResponse.data)
        dispatch(setLeaderboard(convertedData))
      } else {
        dispatch(setLeaderboard({ leaderBoard: [], matches: [] }))
      }
      isInitialized.current = true
    }
  }

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      getAll(Number(param.tournamentId))
      const response = await getTournamentById(Number(param.tournamentId))
      setIsLoading(false)
      dispatch(setGeneral(response.data))
    }
    if (param.tournamentId) {
      fetchLeaderboardData()
    }
  }, [param.tournamentId])

  return (
    <Box className={styles['page-wrapper']}>
      <Box className={styles['page-title']}>Leaderboard</Box>
      {/* FINAL RESULT SECTION */}
      <FinalResultSection leaderboardData={leaderboardData} loading={loading} />
      {/* LEADERBOARD TABLE */}
      <LeaderboardTable leaderboardData={leaderboardData} loading={loading} />
    </Box>
  )
}

export default Leaderboard
