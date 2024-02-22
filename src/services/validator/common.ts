import * as Yup from 'yup'
import {
  EMAIL_REGEX,
  CHARACTERS_REGEX,
  PHONE_NUMBER_REGEX,
  CHARACTERS_ONLY_REGEX,
  PHONE_NUMBER_START_REGEX,
  PHONE_NUMBER_VALID_REGEX
} from '../../constants/regex'
import dayjs from 'dayjs'

const email = Yup.string()
  .trim()
  .required('Email is required.')
  .max(50, 'Email cannot be more than 50 characters')
  .matches(EMAIL_REGEX, 'Please enter a valid email address.')

const password = Yup.string().trim().required('Password is required.').min(6, 'Password must be at least 6 characters')

const categoryName = Yup.string()
  .trim()
  .required('Category name is required.')
  .min(2, 'Category name must be at least 2 characters')
  .max(30, 'Category name must be less than 30 characters')
  .matches(CHARACTERS_REGEX, 'Category name must not contain special characters')

const firstName = Yup.string()
  .trim()
  .required('First name is required')
  .test('no-number', 'First name must not contain numbers', function (value) {
    if (value && /\d/.test(value)) {
      return false
    }
    return true
  })
  .matches(CHARACTERS_ONLY_REGEX, 'First name must not contain special characters')
  .max(30, 'First name cannot be more than 30 characters')

const lastName = Yup.string()
  .trim()
  .required('Last name is required')
  .test('no-number', 'Last name must not contain numbers', function (value) {
    if (value && /\d/.test(value)) {
      return false
    }
    return true
  })
  .matches(CHARACTERS_ONLY_REGEX, 'Last name must not contain special characters')
  .max(30, 'Last name cannot be more than 30 characters')

const phoneNumber = Yup.string()
  .trim()
  .required('Phone number is required')
  .matches(PHONE_NUMBER_REGEX, 'Phone number must not contain special characters')
  .matches(PHONE_NUMBER_START_REGEX, 'Phone number must start with 0')
  .matches(PHONE_NUMBER_VALID_REGEX, 'Phone number must be valid')
  .min(10, 'Phone number cannot be less than 10 digits')
  .max(11, 'Phone number cannot be more than 11 digits')

const dateOfBirth = Yup.date()
  .test('not-today', 'Date of birth cannot be today', (value) => {
    if (value === null) return true
    return !dayjs(value).isSame(dayjs().startOf('day'), 'day')
  })
  .max(dayjs().startOf('day'), 'Date of birth cannot be a future date')
  .test('isValid', (value) => {
    if (value === null) return true
    return dayjs(value).isValid()
  })
  .typeError('Please enter a valid date')
  .nullable()

const title = Yup.string()
  .trim()
  .required('Title is required')
  .min(2, 'Title must be at least 2 characters')
  .max(30, 'Title must be less than 30 characters')
  .matches(CHARACTERS_REGEX, 'Title must not contain special characters')

const selectCategory = Yup.string().required('Category is required.')

const teamName = Yup.string()
  .trim()
  .required('Team name is required.')
  .max(30, 'Team name must be less than 30 characters')
  .matches(CHARACTERS_REGEX, 'Team name must not contain special characters')

const playerName = Yup.string()
  .trim()
  .required('Player name is required')
  .max(30, 'Player name cannot be more than 30 characters')
  .test('no-number', 'Player name must not contain numbers', function (value) {
    if (value && /\d/.test(value)) {
      return false
    }
    return true
  })
  .matches(CHARACTERS_REGEX, 'Player name must not contain special characters')

const phone = Yup.string()
  .trim()
  .matches(PHONE_NUMBER_REGEX, 'Phone number must not contain special characters')
  .matches(PHONE_NUMBER_START_REGEX, 'Phone number must start with 0')
  .matches(PHONE_NUMBER_VALID_REGEX, 'Phone number must be valid')
  .min(10, 'Phone number cannot be less than 10 digits')
  .max(11, 'Phone number cannot be more than 11 digits')

const description = Yup.string().max(100, 'Description cannot be more than 100 characters')

const duration = Yup.number().required('Duration is required').min(1, 'Duration must be greater than 0 minute')

const betweenTime = Yup.number()
  .required('Time between matches is required')
  .min(0, 'Time between matches must not be negative number')

const startTime = Yup.string()
  .required('Start time is required')
  .test('isValid', 'Start time is not a valid time', (value) => {
    if (value === null) return true
    return dayjs(value).isValid()
  })

const endTime = Yup.string()
  .required('End time is required')
  .test('isValid', 'End time is not a valid time', (value) => {
    if (value === null) return true
    return dayjs(value).isValid()
  })
  .test({
    name: 'endTimeCheck',
    message: 'End time must be greater than start time by the specified duration',
    test: function (endTime, context) {
      const { startTime, duration } = context.parent
      if (!startTime || !endTime) {
        return true
      }
      const expectedEndTime = dayjs(startTime).add(duration - 1, 'minutes')
      return dayjs(endTime).isAfter(expectedEndTime)
    }
  })
const teamOneResult = Yup.number()
  .required('Score is required')
  .positive('Score must be a positive number')
  .integer('Score must be an integer')
  .min(0, 'Scores cannot be negative')
const teamTwoResult = Yup.number()
  .required('Score is required')
  .positive('Score must be a positive number')
  .integer('Score must be an integer')
  .min(0, 'Scores cannot be negative')
const durationEvent = Yup.number()
  .required('Duration is required')
  .moreThan(0, 'Duration must be at least 1 minute')
  .lessThan(1440, 'Duration must be less than 24 hours')

const startTimeEventDate = Yup.string()
  .required('Start time is required')
  .test('isValid', 'Start time is not a valid time', (value) => {
    if (value === null) return true
    return dayjs(value).isValid()
  })

const endTimeEventDate = Yup.string()
  .required('End time is required')
  .test('isValid', 'End time is not a valid time', (value) => {
    if (value === null) return true
    return dayjs(value).isValid()
  })

const teamOne = Yup.string().trim().required('Team one is required.')
const teamTwo = Yup.string().trim().required('Team two is required.')

const oldPassword = Yup.string()
  .trim()
  .required('Old password is required.')
  .min(6, 'Old password must be at least 6 characters')
const newPassword = Yup.string()
  .trim()
  .required('New password is required.')
  .min(6, 'New password must be at least 6 characters')
const confirmPassword = Yup.string()
  .trim()
  .required('Confirm password is required.')
  .min(6, 'Confirm password must be at least 6 characters')

export {
  email,
  password,
  categoryName,
  firstName,
  lastName,
  phoneNumber,
  dateOfBirth,
  title,
  selectCategory,
  teamName,
  description,
  phone,
  playerName,
  duration,
  betweenTime,
  startTime,
  endTime,
  teamOneResult,
  teamTwoResult,
  durationEvent,
  startTimeEventDate,
  endTimeEventDate,
  teamOne,
  teamTwo,
  oldPassword,
  newPassword,
  confirmPassword
}
