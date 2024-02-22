import axios from '../../config/axios-config'
import { ParamApi } from '../../../types/common'
import { Organizer } from '../../../types/organizer'

export async function getAllOrganizer(param: ParamApi) {
  const res = await axios({
    url: '/organizer',
    method: 'GET',
    params: param
  })
  return res
}

export async function deleteOrganizer(id: number) {
  const res = await axios({
    url: `/organizer/${id}`,
    method: 'DELETE'
  })
  return res
}

export async function addOrganizer(data: Organizer) {
  const res = await axios({
    url: '/organizer',
    method: 'POST',
    data
  })
  return res
}

export async function getAllOrganizers() {
  const res = await axios({
    url: '/organizer/getAllOrganizer',
    method: 'GET'
  })
  return res
}

export async function getOrganizerById(id: number) {
  const res = await axios({
    url: `/organizer/${id}`,
    method: 'GET'
  })
  return res
}

export async function putOrganizerById(data: Organizer) {
  const res = await axios({
    url: `/organizer/${data.id}`,
    method: 'PUT',
    data: data
  })
  return res
}
