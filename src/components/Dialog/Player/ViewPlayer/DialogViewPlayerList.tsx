import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styles from './DialogViewPlayerList.module.css'
import { useDispatch, useSelector } from 'react-redux'
import TableReused from '../../../../components/Tables'
import Swal from 'sweetalert2'
import { setPlayers, setSelectedPlayer } from '../../../../redux/reducers/players/players.reducer'
import {
  addPlayer,
  deletePlayer,
  getAllPlayersInTeam,
  getPlayerById,
  putPlayerById
} from '../../../../apis/axios/players/player'
import { PlayerAPIRes, PlayerByIdAPIRes } from '../../../../types/common'
import { useLocation, useParams } from 'react-router-dom'
import { convertPlayer } from '../../../../utils/player'
import { DialogAddPlayer } from '../AddPlayer'
import { DialogEditPlayer } from '../EditPlayer'
import { RootState } from '../../../../redux/store'
import dayjs from 'dayjs'

interface DialogProps {
  onAddPlayer: () => void
  onOpen: boolean
  onClose: () => void
  onDelete: () => void
}

const DialogViewPlayerList = ({ onAddPlayer, onOpen, onClose, onDelete }: DialogProps) => {
  const columns = [
    {
      id: 'id',
      sortTable: false,
      sortBy: 'Id',
      label: 'No.',
      left: false,
      style: {
        filed: 'Id',
        width: '5%'
      }
    },
    {
      id: 'playerName',
      sortTable: false,
      label: 'Full Name',
      sortBy: 'playerName',
      left: false,
      style: {
        filed: 'playerName',
        width: '30%'
      }
    },
    {
      id: 'phone',
      sortTable: false,
      label: 'Phone number',
      sortBy: 'phone',
      left: false,
      style: {
        filed: 'phone',
        width: '25%'
      }
    },
    {
      id: 'dateOfBirth',
      sortTable: false,
      label: 'Date of birth',
      sortBy: 'dateOfBirth',
      left: false,
      style: {
        filed: 'dateOfBirth',
        width: '20%'
      }
    }
  ]

  const players = useSelector((state: any) => state.player.players)
  const [totalPlayers, setTotalPlayers] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [update, setUpdate] = useState<boolean>(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const dispatch = useDispatch()
  const location = useLocation()
  const selectedTeamId = useSelector((state: any) => state.player.selectedTeamId)
  const { tournamentId } = useParams()
  const teamId = useSelector((state: RootState) => state.player.selectedTeamId)

  // get all players from DB
  const getAll = useCallback(async () => {
    const tournamentId = Number(location.pathname.split('/')[2])
    const getPlayers = (await getAllPlayersInTeam(tournamentId, selectedTeamId)) as PlayerAPIRes
    if (getPlayers && getPlayers.data) {
      const convertedData = []
      for (const player of getPlayers.data) {
        player.dateOfBirth = player.dateOfBirth ? dayjs(player.dateOfBirth).format('DD/MM/YYYY') : ''
        convertedData.push(convertPlayer(player))
      }
      dispatch(setPlayers([...convertedData]))
      setTotalPlayers(convertedData.length)
    } else {
      dispatch(setPlayers([]))
      setTotalPlayers(0)
    }
  }, [])

  const tournamentStatus = useSelector((state: any) => state.tournament.general.status)
  const handleEdit = useCallback(
    async (rowData: { [key: string]: any }) => {
      try {
        const selectedPlayer = (await getPlayerById(Number(tournamentId), teamId, rowData.playerId)) as PlayerByIdAPIRes
        if (selectedPlayer.data && tournamentStatus !== 'FINISHED' && tournamentStatus !== 'DISCARDED') {
          dispatch(setSelectedPlayer(selectedPlayer.data))
          setIsEditDialogOpen(true)
        } else {
          toast.error('Editing a player is not allowed for a discarded or finished tournament.')
        }
      } catch (err) {
        console.error('Error fetching player', err)
      }
    },
    [dispatch, tournamentStatus]
  )

  const handleDelete = useCallback((rowData: { [key: string]: any }) => {
    const tournamentId = Number(location.pathname.split('/')[2])
    const { playerId } = rowData
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
          container: 'swal2-container',
          title: 'swal2-custom-title'
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = (await deletePlayer(tournamentId, selectedTeamId, playerId)) as PlayerAPIRes
          if (res.success) {
            toast.success('A player is deleted successfully!')
            setUpdate((prev) => !prev)
            onDelete()
          } else {
            toast.error(res.message)
          }
        }
      })
    } else {
      toast.error('Deleting a player is not allowed for a discarded or finished tournament.')
    }
  }, [])

  useEffect(() => {
    getAll()
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update])

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <Dialog
      onClick={handleClickOutside}
      onClose={onClose}
      open={onOpen}
      PaperProps={{
        sx: {
          borderRadius: '1rem',
          width: '50vw!important',
          maxWidth: 'none!important'
        }
      }}
      scroll="paper"
      maxWidth="xl"
      sx={{ zIndex: 1004 }}
    >
      <DialogTitle className={styles['dialog-title']}>Players</DialogTitle>
      <DialogContent className={styles['dialog-container']}>
        {tournamentStatus !== 'DISCARDED' && tournamentStatus !== 'FINISHED' && tournamentStatus !== 'IN_PROGRESS' && (
          <DialogAddPlayer
            addPlayer={addPlayer}
            onAdd={() => {
              setUpdate((prev) => !prev)
              onAddPlayer()
            }}
          />
        )}
        <DialogEditPlayer
          editPlayer={putPlayerById}
          onOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
          }}
        />
        <TableReused
          columns={columns}
          rows={players}
          onEdit={handleEdit}
          onDelete={handleDelete}
          total={totalPlayers}
          loading={loading}
          hidePagination={false}
          showActions={
            tournamentStatus !== 'DISCARDED' && tournamentStatus !== 'FINISHED' && tournamentStatus !== 'IN_PROGRESS'
          }
        />
      </DialogContent>
      <DialogActions className={styles['group-btn']}>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(DialogViewPlayerList)
