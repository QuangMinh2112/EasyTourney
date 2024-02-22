import React from 'react'
import Box from '@mui/material/Box'
import withBaseLogic from '../../hoc/withBaseLogic'
import TableReused from '../../components/Tables'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ParamApi, TeamAPIRes, TeamByIdAPIRes } from '../../types/common'
import { createSearchParams, useParams, useSearchParams } from 'react-router-dom'
import { addTeam, deleteTeam, getAllTeam, getTeamById, putTeamById } from '../../apis/axios/teams/team'
import { useDispatch, useSelector } from 'react-redux'
import { setTeams, setSelectedTeam } from '../../redux/reducers/teams/teams.reducer'
import { DialogEditTeam } from '../../components/Dialog/Team/EditTeam'
import { setPlayers, setSelectedTeamId } from '../../redux/reducers/players/players.reducer'
import DialogViewPlayerList from '../../components/Dialog/Player/ViewPlayer/DialogViewPlayerList'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { DialogAddTeam } from '../../components/Dialog/Team/AddTeam'
import { getTournamentById } from '../../apis/axios/tournaments/tournament'
import { setGeneral } from '../../redux/reducers/tournaments/tournaments.reducer'

const Teams = ({ navigate, location }: any) => {
  const columns = [
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
      id: 'teamName',
      sortTable: false,
      label: 'Team Name',
      sortBy: 'teamName',
      left: false,
      style: {
        filed: 'teamName',
        width: '60%'
      }
    },
    {
      id: 'playerCount',
      sortTable: false,
      label: 'Players',
      sortBy: 'playerCount',
      left: false,
      style: {
        filed: 'playerCount',
        width: '30%'
      }
    }
  ]

  const teams = useSelector((state: any) => state.team.teams)

  const [isOpenPlayerDialog, setIsOpenPlayerDialog] = useState<boolean>(false)
  const [totalTeams, setTotalTeams] = useState<number>(0)
  const [totalCurrentPage, setTotalCurrentPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [update, setUpdate] = useState<boolean>(false)
  const [params] = useSearchParams()
  const pageURL = Number(params.get('page'))
  const [currentPage, setCurrentPage] = useState<number>(pageURL | 1)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const { tournamentId } = useParams()
  const dispatch = useDispatch()
  const isSetPageURL = useRef(false)

  // get all team from DB
  const getAll = async (param: ParamApi, tournamentId: number) => {
    const getTeams = (await getAllTeam(param, tournamentId)) as TeamAPIRes
    if (getTeams.data) {
      dispatch(setTeams([...getTeams.data]))
      setTotalCurrentPage(getTeams?.total)
      setTotalTeams(getTeams?.additionalData?.totalTeamOfTournament)
      setLoading(false)
    }
  }

  const pageSearch = (value: number) => {
    setCurrentPage(() => value)
    isSetPageURL.current = false
    setUpdate((prev) => !prev)
  }

  useEffect(() => {
    if (isSetPageURL.current === false) {
      setCurrentPage(pageURL)
      isSetPageURL.current = true
    }
  }, [pageURL])

  useEffect(() => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: String(currentPage) }).toString()
    })

    const param: ParamApi = {
      page: currentPage
    }
    getAll({ ...param }, Number(tournamentId))
  }, [update])

  const handleOpenPlayerDialog = useCallback((rowData: { [key: string]: any }) => {
    dispatch(setPlayers([]))
    dispatch(setSelectedTeamId(rowData.teamId))
    setIsOpenPlayerDialog(true)
  }, [])

  const tournamentStatus = useSelector((state: any) => state.tournament.general.status)
  const handleEdit = useCallback(
    async (rowData: { [key: string]: any }) => {
      try {
        const selectedTeam = (await getTeamById(rowData['teamId'], Number(tournamentId))) as TeamByIdAPIRes

        // Check if tournamentStatus is not 'discarded'
        if (selectedTeam.data && tournamentStatus !== 'FINISHED' && tournamentStatus !== 'DISCARDED') {
          dispatch(setSelectedTeam(selectedTeam.data))
          setIsEditDialogOpen(true)
        } else {
          toast.error('Editing a team is not allowed for a discarded or finished tournament.')
        }
      } catch (err) {
        console.error('Error fetching team', err)
      }
    },
    [dispatch, tournamentId, tournamentStatus]
  )

  const param: { tournamentId?: string } = useParams()
  useEffect(() => {
    const fetchTournamentData = async () => {
      const response = await getTournamentById(Number(param.tournamentId))
      dispatch(setGeneral(response.data))
    }

    if (param.tournamentId) {
      fetchTournamentData()
    }
  }, [param.tournamentId, update])

  const handleDelete = useCallback(
    (rowData: { [key: string]: any }) => {
      const { teamId } = rowData

      // Check if tournamentStatus is not 'DISCARDED'
      if (tournamentStatus !== 'DISCARDED' && tournamentStatus !== 'FINISHED') {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You will not be able to revert this!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#dc4848',
          cancelButtonColor: 'transient',
          confirmButtonText: 'Yes, delete it!',
          allowOutsideClick: false,
          focusCancel: true,
          customClass: {
            actions: 'swal2-horizontal-buttons',
            title: 'swal2-custom-title'
          }
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = (await deleteTeam(teamId, Number(tournamentId))) as TeamAPIRes
              if (res.success) {
                toast.success('A team is deleted successfully!')
                if (totalCurrentPage === 1 && currentPage > 1) {
                  setCurrentPage((prevPage) => prevPage - 1)
                }
                setUpdate((prev) => !prev)
              } else {
                toast.error(res.message)
              }
            } catch (error) {
              console.error('Error deleting team', error)
            }
          }
        })
      } else {
        toast.error('Deleting a team is not allowed for a discarded or finished tournament.')
      }
    },
    [tournamentStatus, setUpdate, tournamentId, totalCurrentPage, currentPage]
  )
  return (
    <Box sx={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', marginTop: '2rem' }}>
      <Box sx={{ fontWeight: '500', fontSize: '2rem', textAlign: 'center' }}>Participant</Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ alignSelf: 'flex-start', marginBottom: '10px' }}>
          {tournamentStatus !== 'DISCARDED' &&
            tournamentStatus !== 'FINISHED' &&
            tournamentStatus !== 'IN_PROGRESS' && (
              <DialogAddTeam
                addTeam={addTeam}
                onAdd={() => {
                  setCurrentPage(1)
                  setUpdate((prev) => !prev)
                }}
              />
            )}
        </Box>
        <DialogEditTeam
          editTeam={putTeamById}
          onOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
          }}
        />
      </Box>

      <TableReused
        columns={columns}
        rows={teams}
        onOpenPlayerDialog={handleOpenPlayerDialog}
        onEdit={handleEdit}
        onDelete={handleDelete}
        total={totalTeams}
        handlePageSearch={pageSearch}
        totalCurrentPage={totalCurrentPage}
        loading={loading}
        showActions={
          tournamentStatus !== 'DISCARDED' && tournamentStatus !== 'FINISHED' && tournamentStatus !== 'IN_PROGRESS'
        }
      />
      {isOpenPlayerDialog && (
        <DialogViewPlayerList
          onAddPlayer={() => {
            setUpdate((prev) => !prev)
          }}
          onOpen={isOpenPlayerDialog}
          onClose={() => setIsOpenPlayerDialog(false)}
          onDelete={() => {
            setUpdate((prev) => !prev)
          }}
        />
      )}
    </Box>
  )
}

export default withBaseLogic(Teams)
