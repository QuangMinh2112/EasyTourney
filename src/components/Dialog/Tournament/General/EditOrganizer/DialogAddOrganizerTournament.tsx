import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useFormik } from 'formik'
import { Autocomplete, DialogActions, DialogContent, DialogTitle, FormControl, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import styles from './DialogAddOrganizerInTournament.module.css'
import { getAllOrganizers } from '../../../../../apis/axios/organizers/organizer'
import { setSelectOrganizer } from '../../../../../redux/reducers/organizers/organizers.reducer'
import { getTournamentById } from '../../../../../apis/axios/tournaments/tournament'
import { editGeneralTournament } from '../../../../../apis/axios/tournaments/generalTournaments'
import { RootState } from '../../../../../redux/store'
import { setSelectedOrganizer } from '../../../../../redux/reducers/general/general.reducer'
import { updatedOrganizer } from '../../../../../redux/reducers/tournaments/tournaments.reducer'

interface OrganizerProps {
  open: boolean
  setOpen: (value: boolean) => void
}

const DiaLogAddOrganizerInTournamnet = ({ open, setOpen }: OrganizerProps) => {
  const dispatch = useDispatch()
  const [errorOrganizer, setErrorOrganizer] = useState<boolean>(false)
  const organizerList = useSelector((state: any) => state.organizer.selectOrganizers)
  const selectedOrganizer = useSelector((state: any) => state.general.selectedOrganizer)
  const matchingFriends = organizerList.filter((friend: any) => {
    return !selectedOrganizer.some((user: any) => user.id === friend.id)
  })
  const allFullNames = matchingFriends.map((organizer: any) => organizer.fullName)

  const tournament = useSelector((state: RootState) => {
    const selectedTournament = state.tournament.general
    if (Array.isArray(selectedTournament)) {
      return selectedTournament[0] || {}
    }
    return selectedTournament
  })
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllOrganizers()
        const formattedData = response.data.map((organizer: { id: any; firstName: any; lastName: any; email: any }) => {
          const fullNameWithEmail = `${organizer.firstName} ${organizer.lastName} (${organizer.email})`
          return {
            id: organizer.id,
            fullName: fullNameWithEmail
          }
        })
        dispatch(setSelectOrganizer(formattedData))
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  const handleClose = () => {
    setOpen(false)
    formik.resetForm()
  }

  const formik = useFormik({
    initialValues: {
      organizers: ''
    },
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const match = values.organizers.match(/^(.*) \((.*)\)$/)
        if (match) {
          const fullName = match[0]
          const selectedOrganizer = organizerList.find((organizer: any) => organizer.fullName === fullName)
          if (selectedOrganizer) {
            const id = selectedOrganizer.id
            const currentOrganizerIds = await getCurrentOrganizerIds(tournament.id)
            const updatedOrganizerIds = [...currentOrganizerIds, id]
            const organizer = await editOrganizersInTournament(tournament.id, updatedOrganizerIds)
            const organizerUpdate = organizer.organizers
            dispatch(setSelectedOrganizer(organizerUpdate))
            dispatch(updatedOrganizer(organizerUpdate))
            toast.success('Category updated successfully!')
            formik.resetForm()
            handleClose()
          } else {
            console.error('Selected organizer not found')
          }
        } else {
          console.error('Invalid organizers format')
        }
      } catch (error) {
        console.error(error)
      }
    }
  })

  useEffect(() => {
    if (open) {
      formik.resetForm()
      setErrorOrganizer(false)
      formik.setValues({
        organizers: ''
      })
    }
  }, [open])
  const getCurrentOrganizerIds = async (tournamentId: number): Promise<number[]> => {
    try {
      const response = await getTournamentById(tournamentId)
      if (response.data) {
        const organizers = response.data.organizers
        const organizerIds = organizers.map((organizer: any) => organizer.id)
        return organizerIds
      } else {
        console.error('Error getting current organizer IDs')
        return []
      }
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const editOrganizersInTournament = async (tournamentId: number, organizerIds: number[]) => {
    try {
      const updateResponse = await editGeneralTournament(tournamentId, { organizers: organizerIds })
      if (updateResponse.data) {
        const organizerUpdate = updateResponse.data
        return organizerUpdate
      } else {
        console.error('Error updating organization information:')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleBlurOrganizer = () => {
    if (formik.errors.organizers) {
      setErrorOrganizer(false)
    }
    if (selectedValue === '' || selectedValue === null) {
      setErrorOrganizer(true)
    }
  }
  const handleInputChange = (event: React.ChangeEvent<object>, value: string | null) => {
    formik.setFieldValue('organizers', value && value?.trim())
  }

  const selectedValue = formik?.values?.organizers
  useEffect(() => {
    if (selectedValue?.length > 0) {
      setErrorOrganizer(false)
    }
  }, [selectedValue])
  return (
    <Dialog open={open} onClose={handleClose}>
      <Box sx={{ p: 2, minWidth: '300px' }}>
        <DialogTitle className={styles['dialog-title']}>Add Organizer</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <FormControl fullWidth className={styles['form-organizer']}>
              <Box component="label" className={styles['title']}>
                Organizer
              </Box>
              <Autocomplete
                disableClearable={formik?.values?.organizers ? false : true}
                options={allFullNames}
                onChange={(event, value) => {
                  formik.setFieldValue('organizers', value)
                }}
                onBlur={handleBlurOrganizer}
                value={selectedValue}
                ListboxProps={{
                  style: {
                    maxHeight: '195px',
                    whiteSpace: 'pre-wrap'
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="organizers"
                    onChange={(event) => {
                      formik.handleChange(event)
                      handleInputChange(event, event.target.value)
                    }}
                    error={
                      (selectedValue === '' || selectedValue === null) &&
                      errorOrganizer === false &&
                      formik.touched.organizers &&
                      Boolean(formik.errors.organizers)
                    }
                    helperText={
                      (selectedValue === '' || selectedValue === null) &&
                      errorOrganizer === false &&
                      formik.touched.organizers &&
                      formik.errors.organizers
                    }
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        padding: '2px'
                      },
                      '& .MuiFormHelperText-root': {
                        marginLeft: '2px'
                      }
                    }}
                  />
                )}
              />
              {errorOrganizer && (selectedValue === '' || selectedValue === null) ? (
                <Box component="span" className={styles['organizer-error']}>
                  Organizer is required
                </Box>
              ) : null}
            </FormControl>
            <DialogActions className={styles['group-btn']}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button style={{ marginLeft: '12px' }} type="submit" variant="contained">
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Box>
    </Dialog>
  )
}

export default DiaLogAddOrganizerInTournamnet
