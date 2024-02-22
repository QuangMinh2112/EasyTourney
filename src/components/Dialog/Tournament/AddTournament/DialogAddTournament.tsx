/* eslint-disable react/react-in-jsx-scope */
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DatePicker from 'react-multi-date-picker'
import DialogTitle from '@mui/material/DialogTitle'
import DatePanel from 'react-multi-date-picker/plugins/date_panel'
import { memo, useEffect, useState } from 'react'
import { Autocomplete, FormControl, Stack, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { categoriesSelector } from '../../../../redux/reducers/categories/categories.selectors'
import { TournamentSchema } from '../../../../services/validator/tournament.validator'
import { CategoryName } from '../../../../types/category'
import type { DateObject } from 'react-multi-date-picker'
import CustomMultipleInput from '../CustomMultipleInput/CustomMultipleInput'
import styles from './DialogAddTournament.module.css'
import moment from 'moment'
import { Tournament } from '../../../../types/tournament'

interface TournamentProps {
  addTournament: (data: Tournament) => Promise<any>
  open: boolean
  setOpen: (value: boolean) => void
  onAdd: () => void
}

const DialogAddTournament = ({ addTournament, open, setOpen, onAdd }: TournamentProps) => {
  const [dates, setDates] = useState<DateObject[] | []>([])
  const [errorCategory, setErrorCategory] = useState<boolean>(false)
  const [errorDatePicker, setErrorDatePicker] = useState<boolean>(false)

  const { listCategory } = useSelector(categoriesSelector)
  const today = new Date()
  const formik = useFormik({
    initialValues: {
      title: '',
      selectCategory: '',
      categoryId: '',
      description: ''
    },
    validateOnBlur: true,
    validationSchema: TournamentSchema,
    onSubmit: async (value) => {
      try {
        if (dates?.length === 0) {
          setErrorDatePicker(true)
        } else {
          const eventDates = dates?.map((day) => day.format('YYYY-MM-DD'))
          const getCategoryId = listCategory?.find(
            (a: CategoryName) => a.categoryName === value.selectCategory && a.categoryId
          )
          value.title = value.title.trim()
          const payload = { ...value, eventDates, categoryId: getCategoryId?.categoryId }
          await callApi(payload)
        }
      } catch (error) {
        toast.error('An error occurred while creating the catalog!')
      }
    }
  })

  const selectedValue = formik?.values?.selectCategory
  const isOptionExists = listCategory?.some((option: CategoryName) => option.categoryName === selectedValue)
  useEffect(() => {
    if (open) {
      formik.resetForm()
    }
  }, [open])
  useEffect(() => {
    dates?.length > 0 && setErrorDatePicker(false)
  }, [dates])
  useEffect(() => {
    if (selectedValue?.length > 0) {
      setErrorCategory(false)
    }
  }, [selectedValue])
  const handleClose = () => {
    setOpen(false)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const callApi = async (payload: any) => {
    try {
      const response = await addTournament(payload)
      if (response.success) {
        onAdd()
        toast.success('Tournament is created successfully!')
        handleClose()
      } else {
        toast.error('An error occurred while creating the catalog!')
      }
    } catch (error) {
      toast.error('An error occurred while creating the catalog!')
    }
  }
  // eslint-disable-next-line no-undef
  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      if (formik.isValid) {
        handleClose()
      }
    }
  }

  const handleChange = (date: DateObject | DateObject[] | null) => {
    if (date) {
      setDates(Array.isArray(date) ? date : [date])
    }
  }

  const handleBlurCategory = () => {
    if (formik.errors.selectCategory) {
      setErrorCategory(false)
    }
    if (selectedValue === '' || selectedValue === null) {
      setErrorCategory(true)
    }
  }
  // eslint-disable-next-line no-undef
  const handleSubmitTest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (dates?.length === 0) {
      setErrorDatePicker(true)
    }
    formik.handleSubmit()
  }
  // eslint-disable-next-line no-undef
  const handleInputChange = (event: React.ChangeEvent<object>, value: string | null) => {
    formik.setFieldValue('selectCategory', value && value?.trim())
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onClick={handleClickOutside}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" className={styles['tournament-title']}>
        Create Tournament
      </DialogTitle>
      <DialogContent className={styles['tournament-content']}>
        <form onSubmit={handleSubmitTest} className={styles['add-tournament-form']}>
          {/* Title */}
          <Stack>
            <FormControl className={styles['tournament-form-container']} fullWidth>
              <Box component="label" className={styles['tournament-common-title']}>
                Title
                <Box component="span" className={styles['require']}>
                  *
                </Box>
              </Box>
              <TextField
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                variant="outlined"
              />
            </FormControl>
          </Stack>{' '}
          <Stack>
            {/* Description */}
            <FormControl fullWidth className={styles['tournament-form-container']}>
              <Box component="label" className={styles['tournament-common-title']}>
                Description
              </Box>
              <TextField
                id="description"
                name="description"
                multiline
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    padding: '0'
                  }
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </FormControl>{' '}
          </Stack>{' '}
          <Stack>
            {/* Category */}
            <FormControl fullWidth className={styles['tournament-form-category']}>
              <Box component="label" className={styles['tournament-common-title']}>
                Category
                <Box component="span" className={styles['require']}>
                  *
                </Box>
              </Box>
              <Autocomplete
                disableClearable={formik?.values?.selectCategory ? false : true}
                options={listCategory?.map((option: CategoryName) => option.categoryName)}
                onChange={(event: any, value) => formik.setFieldValue('selectCategory', value)}
                value={isOptionExists ? selectedValue : null}
                ListboxProps={{
                  style: {
                    maxHeight: '195px',
                    whiteSpace: 'pre-wrap'
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="selectCategory"
                    onChange={(event) => {
                      formik.handleChange(event)
                      handleInputChange(event, event.target.value)
                    }}
                    onBlur={handleBlurCategory}
                    error={
                      (selectedValue === '' || selectedValue === null) &&
                      errorCategory === false &&
                      formik.touched.selectCategory &&
                      Boolean(formik.errors.selectCategory)
                    }
                    helperText={
                      (selectedValue === '' || selectedValue === null) &&
                      errorCategory === false &&
                      formik.touched.selectCategory &&
                      formik.errors.selectCategory
                    }
                    variant="outlined"
                    className={styles['tournament-select-category']}
                  />
                )}
              />
              {errorCategory && (selectedValue === '' || selectedValue === null) ? (
                <Box component="span" className={styles['tournament-error']}>
                  Category is required
                </Box>
              ) : null}
            </FormControl>{' '}
          </Stack>{' '}
          <Stack>
            {/* Event dates */}
            <Box className={styles['tournament-event-dates']}>
              <Box component="label" className={styles['tournament-common-title']}>
                Event dates
                <Box component="span" className={styles['require']}>
                  *
                </Box>
              </Box>
            </Box>
            <DatePicker
              value={dates}
              onChange={handleChange}
              multiple
              sort
              format="DD/MM/YYYY"
              calendarPosition="top"
              plugins={[<DatePanel />]}
              minDate={moment(today).add(1, 'day').format('DD/MM/YYYY')}
              placeholder="YYYY/MM/DD"
              render={<CustomMultipleInput errorDatePicker={errorDatePicker} />}
            />
            {errorDatePicker && dates?.length === 0 ? (
              <Box component="span" className={styles['tournament-error']}>
                Event dates is required
              </Box>
            ) : null}
          </Stack>
          <DialogActions className={styles['tournament-action']}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button style={{ marginLeft: '12px' }} type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default memo(DialogAddTournament)
