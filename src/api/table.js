import request from '@/utils/request'
import qs from 'qs'

// export function getList(params) {
//   return request({
//     url: '/distr/api/order',
//     method: 'get',
//     params
//   })
// }

export function fetchList(query) {
  return request({
    url: '/distr/api/order',
    method: 'get',
    params: query,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

export function getDetail(id) {
  return request({
    url: '/distr/api/order/' + id,
    method: 'get',
  })
}
