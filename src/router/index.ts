import { createRouter, createWebHashHistory, Router } from 'vue-router'
import Layout from '@/layout'
import { RouterTy } from '@/types/router'

export const constantRoutes: RouterTy = [
  // {
  //   path: '/redirect',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/redirect/:path(.*)',
  //       component: () => import('@/views/redirect/index')
  //     }
  //   ]
  // },
  {
    path: '/login',
    component: () => import('@/views/login/Login.vue'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/clueForm',
    component: () => import('@/views/clueForm/index'),
    hidden: true
  }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes: RouterTy = [
  {
    path: '/',
    component: Layout,
    // redirect: '/clue',
    children: [
      {
        path: '/clue',
        name: 'clue',
        component: () => import('@/views/clue/index'),
        meta: { title: '工作桌面', icon: 'table' }
      },
      {
        path: '/SubordinateClueMenu2',
        name: 'SubordinateClueMenu2',
        component: () => import('@/views/SubordinateClueMenu2/index'),
        meta: { title: 'Table2', icon: 'table' }
      },
      {
        path: '/SubordinateClueMenu',
        name: 'SubordinateClueMenu',
        component: () => import('@/views/SubordinateClueMenu/index'),
        meta: { title: 'Table', icon: 'table' }
      }
    ]
  }
]

const router: Router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes
})

// export function resetRouter() {
//   const newRouter = createRouter({
//     history: createWebHashHistory(),
//     scrollBehavior: () => ({ top: 0 }),
//     routes: constantRoutes
//   })
// }

export default router
