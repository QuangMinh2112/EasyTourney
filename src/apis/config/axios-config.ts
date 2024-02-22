import axios, { AxiosResponse } from 'axios'

const instance = axios.create({
  baseURL: 'http://easy-tourney.mgm-edv.de/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use(
  function (config) {
    const accessToken = window.localStorage.getItem('token')
    if (accessToken) {
      config.headers['Authorization'] = 'Bearer ' + accessToken
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  function (response: AxiosResponse) {
    return response?.data
  },
  function (error) {
    return error.response?.data
  }
)

export default instance
