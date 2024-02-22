import React, { useRef } from 'react'
import Box from '@mui/material/Box'
import withBaseLogic from '../../hoc/withBaseLogic'
import TableReused from '../../components/Tables'
import Input from '../../components/Input'
import { useCallback, useEffect, useState } from 'react'
import { APIRes, CommonAPIRes, ParamApi } from '../../types/common'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import {
  apiDeleteCategory,
  getAllCategories,
  addCategory,
  apiEditCategory,
  getTotalTournamentsByCategory
} from '../../apis/axios/categories/category'
import useDebounce from '../../hooks/useDebounce'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { DialogAddCategory } from '../../components/Dialog/Category/DialogAddCategory'
import { setCategories, setSelectedCategory } from '../../redux/reducers/categories/categories.reducer'
import { DialogEditCategory } from '../../components/Dialog/Category/EditCategory/DialogEditCategory'

const Category = ({ navigate, location }: any) => {
  const columns = [
    {
      id: 'Id',
      sortTable: false,
      label: 'No.',
      left: false,
      style: {
        filed: 'Id',
        width: '70px'
      }
    },
    {
      id: 'categoryName',
      sortTable: true,
      label: 'Name',
      sortBy: 'categoryName',
      left: true,
      style: {
        filed: 'name',
        width: '1000px'
      }
    }
  ]

  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState<string | ''>('')
  const [sortType, setSortType] = useState<'asc' | 'desc' | ''>('')
  const categories = useSelector((state: any) => state.category.categories)
  const [totalCategories, setTotalCategories] = useState<number>(0)
  const [params] = useSearchParams()
  const pageURL = Number(params.get('page'))
  const [currentPage, setCurrentPage] = useState<number>(pageURL | 1)
  const [update, setUpdate] = useState<boolean>(false)
  const [totalCurrentPage, setTotalCurrentPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const [categoryName, setCategoryName] = useState('')
  const [isAdded, setIsAdded] = useState(false)
  const isSetPageURL = useRef(false)

  // get all category from DB
  const getAll = async (param: ParamApi) => {
    const getCategories = (await getAllCategories(param)) as APIRes
    if (getCategories?.data.length !== 0) {
      dispatch(setCategories([...getCategories.data]))
    } else {
      dispatch(setCategories([]))
    }
    setTotalCurrentPage(getCategories?.total)
    setTotalCategories(getCategories?.additionalData?.totalCategories)
    setLoading(false)
  }

  const pageSearch = (value: number) => {
    setCurrentPage(() => value)
    setUpdate((prev) => !prev)
  }

  //delaying the execution of function search
  const debouceSearch = useDebounce({
    value: searchText,
    ms: 800
  })

  useEffect(() => {
    if (pageURL > 0 && isSetPageURL.current === false) {
      setCurrentPage(() => pageURL)
      isSetPageURL.current = true
    }
  }, [pageURL])

  useEffect(() => {
    if (debouceSearch) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ keyword: searchText, sortType: sortType, page: String(currentPage) }).toString()
      })
    } else if (sortType !== '') {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ sortType: sortType, page: String(currentPage) }).toString()
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
      keyword: searchText
    }
    getAll({ ...param })
    setLoading(false)
    setIsAdded(false)
  }, [debouceSearch, update])

  const handleEdit = useCallback(
    (rowData: { [key: string]: any }) => {
      dispatch(setSelectedCategory(rowData))
      setCategoryName(rowData.categoryName)
      setIsEditDialogOpen(true)
    },
    [dispatch]
  )

  const handleDelete = useCallback(
    async (rowData: { [key: string]: any }) => {
      const { categoryId } = rowData //get categoryId
      let warningMessage
      const response = (await getTotalTournamentsByCategory(categoryId)) as CommonAPIRes
      switch (response.total) {
        case 0:
          warningMessage = 'You will not be able to revert this!'
          break
        case 1:
          warningMessage =
            '<p style="margin-top: 0">Deleting this category will delete <span style="color: rgb(220, 72, 72); font-weight: 500">1 tournament</span> currently associated with it.</p> Are you sure you want to proceed?'
          break
        default:
          warningMessage = `<p style="margin-top: 0">Deleting this category will delete <span style="color: rgb(220, 72, 72); font-weight: 500">${response.total} tournaments</span> currently associated with it.</p> Are you sure you want to proceed?`
      }
      Swal.fire({
        title: 'Are you sure?',
        html: `${warningMessage}`,
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
          const res = (await apiDeleteCategory(categoryId)) as APIRes
          if (res.success) {
            toast.success('A category was successfully deleted !')
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
    setUpdate((prev) => !prev)
  }, [])

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
          <DialogAddCategory
            addCategory={addCategory}
            onAdd={() => {
              setIsAdded(true)
              setSortType('')
              setSearchText('')
              setCurrentPage(1)
              setUpdate((prev) => !prev)
            }}
          />
        </Box>
        <DialogEditCategory
          editCategory={apiEditCategory}
          categories={categories}
          onOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          categoryName={categoryName}
        />

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

      <TableReused
        columns={columns}
        rows={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        handleColumnSort={handleColumnSort}
        total={totalCategories}
        handlePageSearch={pageSearch}
        totalCurrentPage={totalCurrentPage}
        loading={loading}
        isAdded={isAdded}
      />
    </Box>
  )
}

export default withBaseLogic(Category)
