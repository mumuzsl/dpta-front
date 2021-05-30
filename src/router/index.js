import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    name: 'Order',
    meta: { title: '订单管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'list/:state',
        name: 'List',
        component: () => import('@/views/order/list/index'),
        meta: { title: '全部', icon: 'table' }
      },
      {
        path: 'list/0',
        name: 'List0',
        meta: { title: '待付款', icon: 'table' }
      },
      {
        path: 'list/1',
        name: 'List1',
        meta: { title: '待发货', icon: 'table' }
      },
      {
        path: 'list/2',
        name: 'List2',
        meta: { title: '已发货', icon: 'table' }
      },
      {
        path: 'list/3',
        name: 'List3',
        meta: { title: '退款中', icon: 'table' }
      },
      {
        path: 'list/4',
        name: 'List4',
        meta: { title: '已成功', icon: 'table' }
      }, {
        path: 'list/-1',
        name: 'List-1',
        meta: { title: '已关闭', icon: 'table' }
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
      },
      {
        path: 'refund/:id',
        name: 'OrderRefund',
        component: () => import('@/views/order/list/refund'),
        hidden: true,
        props: true
      }
    ]
  },


  {
    path: '/person',
    component: Layout,
    redirect: '/person/detail',
    name: 'Person',
    meta: { title: '个人中心', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'detail',
        name: 'Detail',
        component: () => import('@/views/person/detail'),
        meta: { title: '个人信息', icon: 'table' }
      },

      {
        path: 'resve',
        name: 'Resve',
        component: () => import('@/views/person/resve'),
        meta: { title: '预备金管理', icon: 'table' }
      }
    ]
  },

  {
    path: '/credit',
    component: Layout,
    // redirect: '/credit',
    meta: { title: '授信管理', icon: 'table' },
    children: [
      {
        path: 'credit',
        name: 'Credit',
        component: () => import('@/views/credit/index'),
        meta: { title: '授信列表', icon: 'table' }
      },
      {
        path: 'deal',
        name: 'Deal',
        component: () => import('@/views/credit/deal'),
        meta: { title: '交易列表', icon: 'table' }
      },
      {
        path: 'deal-detail',
        name: 'DealDetail',
        component: () => import('@/views/credit/deal-detail'),
        meta: { title: '交易详情', icon: 'table' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
