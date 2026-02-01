import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/api/dpta/distr/api/shop',
        method: 'get',
        params: query
    })
}

export function fetchApps(query) {
    return request({
        url: '/open/api/distr-app',
        method: 'get',
        params: query
    })
}

export function addShop(data) {
    return request({
        url: '/api/dpta/distr/api/shop/add',
        method: 'post',
        data
    })
}


export function fetchComms(shopId, query) {
    return request({
        url: '/api/dpta/distr/api/shop/' + shopId + '/comms',
        method: 'get',
        params: query
    })
}
