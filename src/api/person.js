import request from '@/utils/request'

export function getDetail(query) {
    return request({
        url: '/distr/api/detail',
        method: 'get'
    })
}

export function getLevelIdOptions(query) {
    return request({
        url: '/open/api/distr-level',
        method: 'get'
    })
}

export function getStateOptions(query) {
    return request({
        url: '/distr/api/detail',
        method: 'get'
    })
}


export function getResve(query) {
    return request({
        url: '/distr/api/resve',
        method: 'get',
        params: query
    })
}

export function transfer(data) {
    return request({
        url: '/distr/api/alipay/transfer',
        method: 'post',
        data
    })
}

export function addResve(data) {
    return request({
        url: 'distr/api/resve/add',
        method: 'post',
        data
    })
}
