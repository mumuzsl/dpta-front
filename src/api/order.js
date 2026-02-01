import request from '@/utils/request'

export function downloadExcel(query) {
    return request({
        url: '/api/dpta/distr/api/download/excel',
        method: 'get',
        params: query
    })
}

export function getExcelUrl(query) {
    return request({
        url: '/api/dpta/distr/api/order/excel',
        method: 'get',
        params: query
    })
}

export function getStatis(query) {
    return request({
        url: '/api/dpta/distr/api/order/statis',
        method: 'get',
        params: query
    })
}

export function getComm(id, query) {
    return request({
        url: '/open/goods/' + id,
        method: 'get',
        params: query
    })
}

export function deleteReq(data) {
    return request({
        url: '/open/api/delete',
        method: 'post',
        data
    })
}


export function sendReq(data) {
    return request({
        url: '/open/api/send-comm',
        method: 'post',
        data
    })
}


export function refundReq(data) {
    return request({
        url: '/open/api/refund-finish',
        method: 'post',
        data
    })
}

export function rejectReq(data) {
    return request({
        url: '/open/api/refund/reject',
        method: 'post',
        data
    })
}

export function getDate(params) {
    return request({
        url: '/api/dpta/distr/api/order/statis/date',
        method: 'get',
        params: params
    })
}

