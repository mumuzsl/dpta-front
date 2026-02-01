import request from '@/utils/request'

export function fetchData(query) {
    return request({
        url: '/api/dpta/distr/api/credit',
        method: 'get',
        params: query
    })
}

export function disable(id, query) {
    return request({
        url: '/api/dpta/distr/api/credit/disable/' + id,
        method: 'get',
        params: query
    })
}


export function refund(data) {
    return request({
        url: '/api/dpta/distr/api/credit/refund',
        method: 'post',
        data
    })
}

export function fetchDeal(query) {
    return request({
        url: '/api/dpta/distr/api/deal',
        method: 'get',
        params: query
    })
}

export function getDetail(id) {
    return request({
        url: '/api/dpta/distr/api/deal/' + id,
        method: 'get',
    })
}
