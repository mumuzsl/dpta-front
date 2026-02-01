import request from '@/utils/request'

// export function getStatis(data) {
//   return request({
//     url: '/api/dpta/distr/api/statis/all',
//     method: 'get',
//     data
//   })
// }

export function getTopList(data) {
  return request({
    url: '/api/dpta/distr/api/statis/top',
    method: 'get',
    data
  })
}

export function getNear(data) {
  return request({
    url: '/api/dpta/distr/api/order/statis/recent',
    method: 'get',
    params: data
  })
}


export function getPersonNumber(data) {
  return request({
    url: '/api/dpta/distr/api/statis/recent/person-number',
    method: 'get',
    data
  })
}
export function getPerson(data) {
  return request({
    url: '/api/dpta/distr/api/statis/recent/person',
    method: 'get',
    data
  })
}

export function getPersonTime(data) {
  return request({
    url: '/api/dpta/distr/api/statis/recent/person-time',
    method: 'get',
    data
  })
}

export function mapChart(data) {
  return request({
    url: '/platform/api/paf-comm/show/store',
    method: 'post',
    data
  })
}

