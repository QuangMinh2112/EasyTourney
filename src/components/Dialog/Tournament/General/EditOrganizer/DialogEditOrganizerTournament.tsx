import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { memo, useCallback, useEffect, useState } from 'react'
import styles from './DialogAddOrganizerInTournament.module.css'
import { useDispatch, useSelector } from 'react-redux'
import DiaLogAddOrganizerInTournament from './DialogAddOrganizerTournament'
import TablesGeneral from '../../../../Tables/TablesGeneral/TablesGeneral'
import Swal from 'sweetalert2'
import { getTournamentById } from '../../../../../apis/axios/tournaments/tournament'
import { editGeneralTournament } from '../../../../../apis/axios/tournaments/generalTournaments'
import { toast } from 'react-toastify'
import { updatedOrganizer } from '../../../../../redux/reducers/tournaments/tournaments.reducer'
import { setSelectedOrganizer } from '../../../../../redux/reducers/general/general.reducer'
import { AddCircle } from '@mui/icons-material'

interface DialogProps {
  open: boolean
  setOpen: (value: boolean) => void
}

const DialogEditOrganizerTournament = ({ open, setOpen }: DialogProps) => {
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
      id: 'fullName',
      sortTable: false,
      label: 'Full Name',
      sortBy: 'organizer',
      left: false,
      style: {
        filed: 'organizer',
        width: '45%'
      }
    },
    {
      id: 'email',
      sortTable: false,
      label: 'Email',
      sortBy: 'email',
      left: false,
      style: {
        filed: 'email',
        width: '45%'
      }
    }
  ]
  const [loading, setLoading] = useState<boolean>(true)
  const [update] = useState<boolean>(false)
  const dispatch = useDispatch()
  const organizer = useSelector((state: any) => state.general.selectedOrganizer)
  const [openAddOrganizer, setOpenAddOrganizer] = useState(false)
  const hadnleAddOrganizer = () => {
    setOpenAddOrganizer(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDelete = useCallback(async (rowData: { [key: string]: any }) => {
    const tournamentId = Number(location.pathname.split('/')[2])
    const organizerId = rowData.id
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
        const currentOrganizers = await getOrganizersFromBackend(tournamentId)
        const updatedOrganizers = removeSelectedOrganizer(currentOrganizers, organizerId)
        const organizer = await editOrganizersInTournament(tournamentId, updatedOrganizers)
        const organizerUpdated = organizer.organizers
        dispatch(setSelectedOrganizer(organizerUpdated))
        dispatch(updatedOrganizer(organizerUpdated))
        toast.success('Organizer is deleted successfully!')
      }
    })
  }, [])

  const getOrganizersFromBackend = async (tournamentId: number): Promise<number[]> => {
    const tournamentResponse = await getTournamentById(tournamentId)
    const organizers = tournamentResponse.data.organizers
    const organizerId = organizers.map((organizer: any) => organizer.id)
    return organizerId
  }

  const removeSelectedOrganizer = (currentOrganizers: number[], selectedPlayerId: number): number[] => {
    return currentOrganizers.filter((organizerId) => organizerId !== selectedPlayerId)
  }

  const editOrganizersInTournament = async (tournamentId: number, organizers: number[]) => {
    try {
      const updateResponse = await editGeneralTournament(tournamentId, { organizers })
      if (updateResponse.data) {
        return updateResponse.data
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update])

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      handleClose()
    }
  }

  return (
    <Box>
      <DiaLogAddOrganizerInTournament
        open={openAddOrganizer}
        setOpen={setOpenAddOrganizer}
      ></DiaLogAddOrganizerInTournament>
      <Dialog
        onClick={handleClickOutside}
        onClose={handleClose}
        open={open}
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
        <DialogTitle className={styles['dialog-title']}>Edit Organizers</DialogTitle>
        <DialogContent className={styles['dialog-container']}>
          <Button
            variant="contained"
            onClick={hadnleAddOrganizer}
            className={styles['add-player-btn']}
            style={{
              background: 'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))',
              color: 'white',
              marginBottom: '10px'
            }}
            endIcon={<AddCircle />}
          >
            Add new
          </Button>
          <TablesGeneral columns={columns} rows={organizer} onDelete={handleDelete} loading={loading} />
        </DialogContent>
        <DialogActions className={styles['btn-canlce']}>
          <Button style={{ marginRight: '22px' }} variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default memo(DialogEditOrganizerTournament)
