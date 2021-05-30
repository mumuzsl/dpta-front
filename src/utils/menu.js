/* Layout */
import Layout from '@/layout'

export function distrMenu() {
    return []
}

export function adminMenu() {
    return [{
        path: '/order',
        component: Layout,
        redirect: '/order/list',
        name: 'Order',
        meta: { title: '订单管理', icon: 'el-icon-s-help' },
        children: [
            {
                path: 'list/:state',
                name: 'List',
                component: () => import('@/views/order/all/index'),
                meta: { title: '列表', icon: 'table' }
            },
            {
                path: 'detail/:id',
                name: 'OrderDetail',
                component: () => import('@/views/order/detail/index'),
                props: true,
                hidden: true,
                meta: { title: '订单详情', icon: 'table' }
            },
            {
                path: 'excel',
                name: 'Excel',
                component: () => import('@/views/order/excel/index'),
                meta: { title: 'Excel', icon: 'dashboard' }
            }
        ]
    }]
}