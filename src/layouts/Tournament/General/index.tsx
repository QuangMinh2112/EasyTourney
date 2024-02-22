/* eslint-disable react/react-in-jsx-scope */
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useCallback, useEffect, useState } from 'react'
import styles from './General.module.css'
import { checkLengthDescription, convertDateFormat } from '../../../utils/function'
import TableReused from '../../../components/Tables'
import { useParams } from 'react-router'
import { getTournamentById } from '../../../apis/axios/tournaments/tournament'
import DialogEditTournamentTitle from '../../../components/Dialog/Tournament/General/EditTitle/DialogEditTitle'
import DialogEditDescription from '../../../components/Dialog/Tournament/General/EditDescription/DialogEditDescription'
import DiaLogEditCategoryInTournamnet from '../../../components/Dialog/Tournament/General/EditCategory/DialogEditCategory'
import DialogEditOrganizerTournament from '../../../components/Dialog/Tournament/General/EditOrganizer/DialogEditOrganizerTournament'
import DialogEditEventDateTournament from '../../../components/Dialog/Tournament/General/EditEventDate/DialogEditEventDateTournament'
import { useDispatch, useSelector } from 'react-redux'
import {
  setEventdate,
  setSelectedCategory,
  setSelectedDescription,
  setSelectedEventDate,
  setSelectedOrganizer,
  setSelectedTitle
} from '../../../redux/reducers/general/general.reducer'
import { setGeneral } from '../../../redux/reducers/tournaments/tournaments.reducer'
import { MdEditSquare } from 'react-icons/md'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { discardTournament } from '../../../apis/axios/tournaments/generalTournaments'
import { GeneralTournamentAPIRes } from '../../../types/common'
import noItem from '../../../assets/no.png'

const General = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(true)
  const tournamentData = useSelector((state: any) => state.tournament.general)
  const [openTitle, setOpenTitle] = useState(false)
  const [openDescription, setOpenDescription] = useState(false)
  const [openCategory, setOpenCategory] = useState(false)
  const [openOrganizer, setOpenOrganizer] = useState(false)
  const [openEventDate, setOpenEventDate] = useState(false)
  const generalTournament = useSelector((state: any) => state.tournament.general)
  const [isFinishedOrDiscarded, setIsFinishedOrDiscarded] = useState(false)
  const [isDiscardVisible, setIsDiscardVisible] = useState(!isFinishedOrDiscarded)

  const handleClickOpenTitle = useCallback(() => {
    setOpenTitle(true)
    dispatch(setSelectedTitle(generalTournament.title))
  }, [dispatch, generalTournament?.title, setOpenTitle])

  const handleEditCategory = useCallback(() => {
    setOpenCategory(true)
    dispatch(setSelectedCategory(generalTournament.category.categoryName))
  }, [dispatch, generalTournament.category?.categoryName, setOpenCategory])

  const handleEditDescription = useCallback(() => {
    setOpenDescription(true)
    dispatch(setSelectedDescription(generalTournament.description))
  }, [dispatch, generalTournament.description, setOpenDescription])

  const handleEditOrganizer = useCallback(() => {
    setOpenOrganizer(true)
    dispatch(setSelectedOrganizer(generalTournament.organizers))
  }, [dispatch, generalTournament.organizers, setOpenOrganizer])
  const handleEditEventDate = useCallback(() => {
    setOpenEventDate(true)
    dispatch(setSelectedEventDate(generalTournament.eventDates))
  }, [dispatch, generalTournament.eventDates, setOpenEventDate])

  const columnsOrganizer = [
    {
      id: 'Id',
      sortTable: false,
      label: 'No.',
      left: false,
      style: {
        filed: 'Id',
        width: '10%'
      }
    },
    {
      id: 'fullName',
      sortTable: false,
      label: 'Full Name',
      left: false,
      style: {
        filed: 'fullName',
        width: '45%'
      }
    },
    {
      id: 'email',
      sortTable: false,
      label: 'Email',
      left: false,
      style: {
        filed: 'email',
        width: '45%'
      }
    }
  ]

  const columnsEventDates = [
    {
      id: 'Id',
      sortTable: false,
      label: 'No.',
      left: false,
      style: {
        filed: 'Id',
        width: '10%'
      }
    },
    {
      id: 'date',
      sortTable: false,
      label: 'Dates',
      left: false,
      style: {
        filed: 'event',
        width: '90%'
      }
    }
  ]

  const param: { tournamentId?: string } = useParams()
  useEffect(() => {
    const fetchTournamentData = async () => {
      const response = (await getTournamentById(Number(param.tournamentId))) as GeneralTournamentAPIRes
      dispatch(setGeneral(response?.data))
      dispatch(setEventdate(response?.additionalData))
      setLoading(false)
      setIsFinishedOrDiscarded(response?.data?.status === 'FINISHED' || response?.data?.status === 'DISCARDED')
    }

    if (param.tournamentId) {
      fetchTournamentData()
    }
  }, [param.tournamentId, isDiscardVisible])
  const handleDiscard = useCallback(async () => {
    const tournamentId = Number(location.pathname.split('/')[2])
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc4848',
      cancelButtonColor: 'transient',
      confirmButtonText: 'Yes, discard it!',
      allowOutsideClick: false,
      focusCancel: true,
      customClass: {
        actions: 'swal2-horizontal-buttons',
        container: 'swal2-container',
        title: 'swal2-custom-title'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await discardTournament(tournamentId)
        toast.success('Discarded successfully')
        setIsDiscardVisible(false)
      }
    })
  }, [])
  if (!tournamentData) {
    return (
      <>
        <Box className={styles['general-wrapper']}>
          <Box className={styles['general-info']}>General Information</Box>
          <Box className={styles['no-match-message']}>
            <img width="200px" height="200px" src={noItem} alt="" />
            <Box sx={{ margin: '1rem 0' }}>
              <Typography variant="h5">There are no tournament</Typography>
            </Box>
          </Box>
        </Box>
      </>
    )
  } else {
    const eventDates: any[] = convertDateFormat(tournamentData.eventDates)
    eventDates.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)

      return dateA.getTime() - dateB.getTime()
    })

    return (
      <Box className={styles['general-container']}>
        <Box className={styles['general-wrapper']}>
          <Box className={styles['general-info']}>General Information</Box>
          {/* title */}
          <Box className={styles['general-wrapper-title']}>
            <Box className={styles['general-title-common']}>
              Title
              {!isFinishedOrDiscarded && isDiscardVisible && (
                <Button
                  title="Edit"
                  sx={{
                    backgroundColor: 'white',
                    minWidth: '1rem',
                    padding: '0.25rem'
                  }}
                  onClick={handleClickOpenTitle}
                >
                  <MdEditSquare color="green" size={20} />
                </Button>
              )}
            </Box>
            <Box component="span">{tournamentData.title}</Box>
          </Box>
          {/* category */}
          <Box className={styles['general-wrapper-common']}>
            <Box className={styles['general-title-common']}>
              Category
              {!isFinishedOrDiscarded && isDiscardVisible && (
                <Button
                  title="Edit"
                  sx={{
                    backgroundColor: 'white',
                    minWidth: '1rem',
                    padding: '0.25rem'
                  }}
                  onClick={handleEditCategory}
                >
                  <MdEditSquare color="green" size={20} />
                </Button>
              )}
            </Box>
            <Box component="span">
              {' '}
              {tournamentData && tournamentData.category && tournamentData.category.categoryName}
            </Box>
          </Box>
          {/* Description */}
          <Box className={styles['general-wrapper-common']}>
            <Box className={styles['general-title-common']}>
              Description
              {!isFinishedOrDiscarded && isDiscardVisible && (
                <Button
                  title="Edit"
                  sx={{
                    backgroundColor: 'white',
                    minWidth: '1rem',
                    padding: '0.25rem'
                  }}
                  onClick={handleEditDescription}
                >
                  <MdEditSquare color="green" size={20} />
                </Button>
              )}
            </Box>
            <Box component="span" className={styles['general-description-content']} title={tournamentData.description}>
              {checkLengthDescription(tournamentData.description, 500)}
            </Box>
          </Box>
          {/* Organizer */}
          <Box className={styles['general-wrapper-common']}>
            <Box className={styles['general-title-common']}>
              Organizers
              {!isFinishedOrDiscarded && isDiscardVisible && (
                <Button
                  title="Edit"
                  sx={{
                    backgroundColor: 'white',
                    minWidth: '1rem',
                    padding: '0.25rem'
                  }}
                  onClick={handleEditOrganizer}
                >
                  <MdEditSquare color="green" size={20} />
                </Button>
              )}
            </Box>
            <Box className={styles['general-organizer-table']}>
              {tournamentData?.organizers ? (
                <TableReused
                  columns={columnsOrganizer}
                  rows={tournamentData.organizers}
                  total={tournamentData.organizers.length}
                  showActions={false}
                  hidePagination={false}
                  loading={loading}
                />
              ) : (
                <div>No organizers available</div>
              )}
            </Box>
          </Box>
          {/* Event dates */}
          <Box className={styles['general-wrapper-common']}>
            <Box className={styles['general-title-common']}>
              Event dates
              {!isFinishedOrDiscarded && isDiscardVisible && (
                <Button
                  title="Edit"
                  sx={{
                    backgroundColor: 'white',
                    minWidth: '1rem',
                    padding: '0.25rem'
                  }}
                  onClick={handleEditEventDate}
                >
                  <MdEditSquare color="green" size={20} />
                </Button>
              )}
            </Box>
            <Box className={styles['general-eventdates-table']}>
              <TableReused
                columns={columnsEventDates}
                rows={eventDates ?? []}
                total={(eventDates ?? []).length}
                showActions={false}
                hidePagination={false}
                loading={loading}
              />
            </Box>
          </Box>
          {/* Discard tournament */}
          {!isFinishedOrDiscarded && (
            <Box className={styles['general-wrapper-common']}>
              {isDiscardVisible && (
                <Box>
                  <Box className={styles['general-discard-content']}>Discard this tournament</Box>
                  <Box className={styles['general-wrapper-discard']}>
                    <Typography className={styles['general-text-warning']}>
                      Once you discard this tournament, there is no going back. Please be certain.
                    </Typography>
                    <Button onClick={handleDiscard} className={styles['general-btn-discard']}>
                      <Typography component="h2" className={styles['general-discard-text']}>
                        Discard
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
        <DialogEditTournamentTitle open={openTitle} setOpen={setOpenTitle}></DialogEditTournamentTitle>
        <DialogEditDescription open={openDescription} setOpen={setOpenDescription}></DialogEditDescription>
        <DiaLogEditCategoryInTournamnet open={openCategory} setOpen={setOpenCategory}></DiaLogEditCategoryInTournamnet>
        <DialogEditOrganizerTournament open={openOrganizer} setOpen={setOpenOrganizer}></DialogEditOrganizerTournament>
        <DialogEditEventDateTournament open={openEventDate} setOpen={setOpenEventDate}></DialogEditEventDateTournament>
      </Box>
    )
  }
}

export default General
