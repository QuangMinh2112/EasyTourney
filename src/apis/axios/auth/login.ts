import axios from '../../config/axios-config'
import { UserResponse } from '../../../types/user'

export const loginRequest = (data: any) =>
  axios({
    url: '/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  }) as unknown as UserResponse

export const checkToken = (data: any) => {
  const res = axios({
    url: '/organizer/getMe',
    method: 'GET',
    data: data
  })
  return res
}

export const changePassword = (data: any) => {
  const res = axios({
    url: '/organizer/changePassword',
    method: 'PUT',
    data
  })

  return res
}
