import Box from '@mui/material/Box'
import withBaseLogic from '../../hoc/withBaseLogic'
import TableReused from '../../components/Tables'
import Input from '../../components/Input'
import { useCallback, useRef, useState } from 'react'
import React, { useEffect } from 'react'
import { OrganizerAPIRes, OrganizerByIdAPIRes, ParamApi } from '../../types/common'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import useDebounce from '../../hooks/useDebounce'
import {
  addOrganizer,
  deleteOrganizer,
  getAllOrganizer,
  getOrganizerById,
  putOrganizerById
} from '../../apis/axios/organizers/organizer'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { DialogAddOrganizer } from '../../components/Dialog/Organizer/AddOrganizer'
import { useDispatch, useSelector } from 'react-redux'
import { setOrganizer, setSelectedOrganizer } from '../../redux/reducers/organizers/organizers.reducer'
import dayjs from 'dayjs'
import { DialogEditOrganizer } from '../../components/Dialog/Organizer/EditOrganizer'

const Organizers = ({ navigate, location }: any) => {
  const columns = [
    {
      id: 'Id',
      sortTable: false,
      sortBy: 'Id',
      label: 'No.',
      left: false,
      style: {
        filed: 'Id',
        width: '70px'
      }
    },
    {
      id: 'fullName',
      sortTable: true,
      label: 'Full Name',
      sortBy: 'fullName',
      left: false,
      style: {
        filed: 'fullName',
        width: '250px'
      }
    },
    {
      id: 'email',
      sortTable: true,
      label: 'Email',
      sortBy: 'email',
      left: false,
      style: {
        filed: 'email',
        width: '250px'
      }
    },
    {
      id: 'phoneNumber',
      sortTable: false,
      label: 'Phone number',
      sortBy: 'phoneNumber',
      left: false,
      style: {
        filed: 'phoneNumber',
        width: '250px'
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
        width: '240px'
      }
    },
    {
      id: 'totalTournament',
      sortTable: true,
      label: 'Total tournaments',
      sortBy: 'totalTournament',
      left: false,
      style: {
        filed: 'totalTournament',
        width: '150px'
      }
    },
    {
      id: 'createdAt',
      sortTable: true,
      label: 'Created At',
      sortBy: 'createdAt',
      left: false,
      style: {
        filed: 'createdAt',
        width: '240px'
      }
    }
  ]

  const [searchText, setSearchText] = useState<string | ''>('')
  const [sortType, setSortType] = useState<'asc' | 'desc' | ''>('')
  const [params] = useSearchParams()
  const pageURL = Number(params.get('page'))
  const [sortValue, setSortValue] = useState<string | ''>('')
  const organizers = useSelector((state: any) => state.organizer.organizers)
  const [totalOrganizer, setTotalOrganizer] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(pageURL | 1)

  const [totalCurrentPage, setTotalCurrentPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [update, setUpdate] = useState<boolean>(false)
  const [isAdded, setIsAdded] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const dispatch = useDispatch()
  const isSetPageURL = useRef(false)

  // get all organizer from DB
  const getAll = async (param: ParamApi) => {
    const getOrganizers = (await getAllOrganizer(param)) as OrganizerAPIRes
    if (getOrganizers?.data.length !== 0) {
      const formattedData = getOrganizers?.data.map((e) => {
        return {
          ...e,
          createdAt: dayjs(e.createdAt).format('DD/MM/YYYY hh:mm:ss A'),
          dateOfBirth: e.dateOfBirth ? dayjs(e.dateOfBirth).format('DD/MM/YYYY') : ''
        }
      })
      dispatch(setOrganizer([...formattedData]))
    } else {
      dispatch(setOrganizer([]))
    }
    setTotalCurrentPage(getOrganizers?.total)
    setTotalOrganizer(getOrganizers?.additionalData?.totalOrganizer)
    setLoading(false)
  }

  const pageSearch = (value: number) => {
    setCurrentPage(() => value)
    isSetPageURL.current = false
    setUpdate((prev) => !prev)
  }

  //delaying the execution of function search
  const debouceSearch = useDebounce({
    value: searchText,
    ms: 800
  })

  const handleEdit = useCallback(
    async (rowData: { [key: string]: any }) => {
      try {
        const selectedOrganizer = (await getOrganizerById(rowData.id)) as OrganizerByIdAPIRes
        dispatch(setSelectedOrganizer(selectedOrganizer.data))
        setIsEditDialogOpen(true)
      } catch (err) {
        console.error('Error fetching organizer', err)
      }
    },
    [dispatch]
  )

  const handleDelete = useCallback(
    (rowData: { [key: string]: any }) => {
      const { id } = rowData //get organizerId
      console.log(totalCurrentPage, currentPage)

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
          const res = (await deleteOrganizer(id)) as OrganizerAPIRes
          if (res.success) {
            toast.success('An organizer is deleted successfully!')
            if (totalCurrentPage === 1 && currentPage > 1) {
              setCurrentPage((prevPage) => prevPage - 1)
            }
            setUpdate((prev) => !prev)
          } else {
            toast.error(res.message)
          }
        }
      })
    },
    [totalCurrentPage, currentPage]
  )

  const handleColumnSort = useCallback((idColumm: any, sortType: 'asc' | 'desc' | '') => {
    setSortType(sortType)
    if (idColumm === 'createdAt') {
      setSortValue('created_at')
    } else if (idColumm === 'phoneNumber') {
      setSortValue('phone_number')
    } else {
      setSortValue(idColumm)
    }
    setUpdate((prev) => !prev)
  }, [])

  useEffect(() => {
    if (isSetPageURL.current === false) {
      setCurrentPage(() => pageURL)
      isSetPageURL.current = true
    }
  }, [pageURL])

  useEffect(() => {
    //create URL search params
    if (debouceSearch) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ keyword: searchText, sortType: sortType, page: String(currentPage) }).toString()
      })
    } else if (sortType !== '' && sortValue) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ sortValue: sortValue, sortType: sortType, page: String(currentPage) }).toString()
      })
    } else {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ page: String(currentPage) }).toString()
      })
    }

    const param: ParamApi = {
      sortType: sortType,
      page: currentPage,
      keyword: searchText,
      sortValue: sortValue
    }
    getAll(param)
    setLoading(false)
    setIsAdded(false)
  }, [debouceSearch, update])

  return (
    <Box sx={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', marginTop: '1rem' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.25rem',
          flexWrap: 'wrap'
        }}
      >
        <Box sx={{ alignSelf: 'flex-start', marginBottom: '10px' }}>
          <DialogAddOrganizer
            addOrganizer={addOrganizer}
            onAdd={() => {
              setIsAdded(true)
              setSortType('')
              setSearchText('')
              setCurrentPage(1)
              setUpdate((prev) => !prev)
            }}
          />
        </Box>
        <Box sx={{ alignSelf: 'flex-end' }}>
          <Input
            label="Search"
            id="outlined-search"
            placeholder="Search here..."
            handleChange={(e) => {
              setCurrentPage(1)
              setSearchText(e.target.value)
            }}
            value={searchText}
          />
        </Box>
      </Box>
      <DialogEditOrganizer
        editOrganizer={putOrganizerById}
        onOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
        }}
      />
      <TableReused
        columns={columns}
        rows={organizers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        handleColumnSort={handleColumnSort}
        total={totalOrganizer}
        handlePageSearch={pageSearch}
        totalCurrentPage={totalCurrentPage}
        loading={loading}
        isAdded={isAdded}
      />
    </Box>
  )
}

export default withBaseLogic(Organizers)
