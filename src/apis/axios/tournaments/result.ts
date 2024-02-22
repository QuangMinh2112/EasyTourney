import axios from '../../config/axios-config'

export async function getAllResult(id: number) {
  const res = await axios({
    url: `/tournament/${id}/match/result`,
    method: 'GET'
  })
  return res
}

export async function editResult(id: number, idMatch: number, data: any) {
  const res = await axios({
    url: `/tournament/${id}/match/result/${idMatch}`,
    method: 'PUT',
    data
  })
  return res
}
