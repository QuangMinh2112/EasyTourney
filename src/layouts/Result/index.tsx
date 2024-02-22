import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import styles from './Result.module.css'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllResult } from '../../apis/axios/tournaments/result'
import { Button, Tooltip, Typography } from '@mui/material'
import { setResult, setSelectedGoal } from '../../redux/reducers/result/result.reducer'
import { DialogEditScore } from '../../components/Dialog/Result/DialogEditScore'
import moment from 'moment'
import { getTournamentById } from '../../apis/axios/tournaments/tournament'
import { setGeneral } from '../../redux/reducers/tournaments/tournaments.reducer'
import { useParams } from 'react-router-dom'
import noresult from '../../assets/no.png'
import { PDFDownloadLink } from '@react-pdf/renderer'
import PDFResult from '../../components/PDF/PDFResult/PDFResut'
import DownloadingIcon from '@mui/icons-material/Downloading'
import PDFDateResult from '../../components/PDF/PDFResult/PDFDateResult'
import Swal from 'sweetalert2'

const Result = () => {
  const dispatch = useDispatch()
  const param: { tournamentId?: string } = useParams()
  const pathSegments = location.pathname.split('/').filter((segment) => segment !== '')
  const result = useSelector((state: any) => state.result.resultMatch)
  const [openScore, setOpenScore] = useState(false)
  const general = useSelector((state: any) => state.tournament.general)
  const titleTournament = general.title
  const categoryTournament = general?.category?.categoryName
  const organizerTournament = general?.organizers
  const organizers = organizerTournament?.map((organizer: any) => organizer.fullName)
  const isDiscarded = general.status === 'DISCARDED'

  const handleEditScore = (match: any, date: string) => {
    setOpenScore(true)
    console.log(date)
    dispatch(setSelectedGoal(match))
  }

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const tournamentId = Number(pathSegments[1])
        const result = await getAllResult(tournamentId)
        result.data.map((day: any) => ({
          ...day,
          matches: day.matches.sort((a: any, b: any) => {
            const timeA: any = moment(`${day.date} ${a.startTime}`)
            const timeB: any = moment(`${day.date} ${b.startTime}`)
            return timeA.toDate() - timeB.toDate()
          })
        }))

        result.data.sort((a: any, b: any) => {
          const dateA: any = moment(a.date)
          const dateB: any = moment(b.date)
          return dateA.toDate() - dateB.toDate()
        })
        dispatch(setResult(result.data))
      } catch (error) {
        console.error(error)
      }
    }
    fetchResult()
  }, [])

  useEffect(() => {
    const fetchTournamentData = async () => {
      const response = await getTournamentById(Number(param.tournamentId))
      dispatch(setGeneral(response.data))
    }

    if (param.tournamentId) {
      fetchTournamentData()
    }
  }, [param.tournamentId])
  const handleDiscard = () => {
    Swal.fire({
      text: 'You cannot edit scores because this tournament has been discarded!',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#dc4848',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
      focusCancel: true,
      customClass: {
        container: 'swal2-container',
        title: 'swal2-custom-title'
      }
    })
  }

  return (
    <Box className={styles['result-container']}>
      <Box className={styles['result-wrapper']}>
        <Box className={styles['result-top']}>
          <Box className={styles['result-info']}>Result</Box>
        </Box>
        {result?.length > 0 && (
          <>
            <Box className={styles['result-pdf']}>
              <PDFDownloadLink
                style={{ color: 'bule !important' }}
                document={
                  <PDFResult
                    result={result}
                    titleTournament={titleTournament}
                    category={categoryTournament}
                    organizer={organizers}
                  />
                }
                fileName={`${titleTournament}_Result`}
              >
                {({ loading }) =>
                  loading ? (
                    <Button
                      className={styles['btn-add']}
                      variant="contained"
                      style={{
                        background: 'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))',
                        color: 'white'
                      }}
                      endIcon={<DownloadingIcon />}
                    >
                      Export to PDF
                    </Button>
                  ) : (
                    <Button
                      className={styles['btn-add']}
                      variant="contained"
                      style={{
                        background: 'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))',
                        color: 'white'
                      }}
                      endIcon={<DownloadingIcon />}
                    >
                      Export to PDF
                    </Button>
                  )
                }
              </PDFDownloadLink>
            </Box>
          </>
        )}
        <Box className={styles['result-container']}>
          <Box className={styles['result-content']}>
            {result?.length > 0 ? (
              result.map((day: any, index: any) => (
                <Box id="content" key={index} className={styles['result-item']}>
                  <Box className={styles['result-header']}>
                    <Box className={styles['result-date']}>{moment(day.date).format('dddd, MMMM D, YYYY')}</Box>
                    <Tooltip title="Export to PDF" placement="top">
                      <Box className={styles['result-icon']}>
                        <PDFDownloadLink
                          style={{ color: 'bule !important' }}
                          document={
                            <PDFDateResult
                              matches={day.matches.map((match: any) => ({ ...match, date: day.date }))}
                              titleTournament={titleTournament}
                              category={categoryTournament}
                              organizer={organizers}
                            />
                          }
                          fileName={`${titleTournament}_${day.date}_Result`}
                        >
                          {({ loading }) => (loading ? '' : <DownloadingIcon />)}
                        </PDFDownloadLink>
                      </Box>
                    </Tooltip>
                  </Box>
                  {day?.matches?.map((match: any, matchIndex: any) => (
                    <Box
                      key={matchIndex}
                      className={`${styles['result-match']} ${matchIndex === 1 ? styles['special-background'] : ''}`}
                    >
                      <Box className={styles['result-time']}>
                        <time>{moment(match.startTime, 'HH:mm:ss').format('HH:mm')}</time>
                        <time>{moment(match.endTime, 'HH:mm:ss').format('HH:mm')}</time>
                      </Box>
                      <Box className={styles['match']}>
                        <Box className={styles['team-left']}>{match.teamOneName}</Box>
                        <Tooltip
                          title={isDiscarded ? 'Cannot edit score for discarded tournament' : 'Edit score'}
                          placement="top"
                        >
                          <Box
                            onClick={() => {
                              if (isDiscarded) {
                                handleDiscard()
                              } else {
                                handleEditScore(match, day.date)
                              }
                            }}
                            className={styles['score']}
                          >
                            <span className={styles.scoreA}>{match.teamOneResult}</span>-
                            <span className={styles.scoreB}>{match.teamTwoResult}</span>
                          </Box>
                        </Tooltip>
                        <Box className={styles['team-right']}>{match.teamTwoName}</Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ))
            ) : (
              <Box className={styles['no-match-message']}>
                <img width="200px" height="200px" src={noresult} alt="" />
                <Box sx={{ margin: '1rem 0' }}>
                  <Typography variant="h5">
                    There are no match results. Please create a match schedule in advance.
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
        <DialogEditScore open={openScore} setOpen={setOpenScore} />
      </Box>
    </Box>
  )
}

export default Result
