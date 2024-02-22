import axios from '../../config/axios-config'
import { ParamApi } from '../../../types/common'
import { CategoryName } from '../../../types/category'

export async function getAllCategories(param: ParamApi) {
  const res = await axios({
    url: '/category',
    method: 'GET',
    params: param
  })
  return res
}

export async function apiDeleteCategory(id: number) {
  const res = await axios({
    url: `/category/${id}`,
    method: 'DELETE'
  })
  return res
}

export async function addCategory(data: CategoryName) {
  const res = await axios({
    url: '/category',
    method: 'POST',
    data
  })
  return res
}

export async function getAllCategory() {
  const res = await axios({
    url: '/category/all',
    method: 'GET'
  })
  return res
}

export async function apiEditCategory(id: number, data: any) {
  const res = await axios({
    url: `/category/${id}`,
    method: 'PUT',
    data
  })
  return res
}

export async function getTotalTournamentsByCategory(categoryId: number) {
  const res = await axios({
    url: `/category/countTournament/${categoryId}`,
    method: 'GET'
  })
  return res
}
