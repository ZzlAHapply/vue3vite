import { constantRoutes, asyncRoutes } from '@/router'
import settings from '@/settings'
import { PermissionTy } from '@/types/store'
import { RouteItemTy, RouterRowTy, RouterTy } from '@/types/router'
import { ObjTy } from '@/types/common'
import store from '../index'
const modules = import.meta.glob('../../views/*/*.ts')
/**
 * Use meta.code to determine if the current user has permission
 * @param codeArr
 * @param routeItem
 */
function hasCodePermission(codeArr: Array<number>, routeItem: RouteItemTy) {
  if (routeItem.meta && routeItem.meta.code) {
    return codeArr.includes(routeItem.meta.code) || routeItem.hidden
  } else {
    return true
  }
}
/**
 * Use meta.code to determine if the current user has permission
 * @param codeArr
 * @param asyncRoutes
 */
function filterRouterByCodeArr(codeArr: Array<number>, asyncRoutes: RouterTy): Promise<RouterTy> {
  return new Promise((resolve) => {
    const filterRouter: RouterTy = []
    asyncRoutes.forEach(async (routeItem: RouterRowTy) => {
      if (hasCodePermission(codeArr, routeItem)) {
        if (routeItem.children) {
          routeItem.children = await filterRouterByCodeArr(codeArr, routeItem.children)
        }
        filterRouter.push(routeItem)
      }
    })
    resolve(filterRouter)
  })
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param hasRoute 后台获取的路由
 */
export function filterAsyncRoutes(routes: RouterTy, hasRoute: Array<any>) {
  let component: any = routes[0].component
  const res: RouterTy = JSON.parse(JSON.stringify(routes))
  res[0].component = component
  res[0].redirect = '/' + hasRoute[0].component
  res[0].children = []
  hasRoute.forEach((route) => {
    let r: RouterRowTy = {
      component: modules[`../../views/${route.component}/index.ts`],
      children: [],
      meta: { ...route.meta },
      name: route.name,
      path: route.path
    }
    res[0].children?.push(r)
  })
  return res
}

const state: PermissionTy = {
  isGetUserInfo: false, // get userInfo
  routes: [], //将过滤后的异步路由和静态路由集合
  addRoutes: [] //过滤后的异步路由
}

const actions = {
  generateRoutes({ commit }: ObjTy, roles: Array<string>) {
    return new Promise(async (resolve) => {
      let accessedRoutes
      if (settings.permissionMode === 'roles') {
        //filter by role
        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, store.getters.menus[0].children)
        }
      } else {
        //filter by codeArr
        //req code arr
        let codeArr: any = localStorage.getItem('codeArr')
        if (codeArr) {
          codeArr = JSON.parse(codeArr)
        } else {
          localStorage.setItem('codeArr', JSON.stringify([1]))
          codeArr = localStorage.getItem('codeArr')
        }
        accessedRoutes = await filterRouterByCodeArr(codeArr, asyncRoutes)
      }
      commit('M_routes', accessedRoutes)
      store.commit('permission/M_isGetUserInfo', true)
      resolve(accessedRoutes)
    })
  }
}

const mutations = {
  M_routes: (state: PermissionTy, routes: RouterTy) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  M_isGetUserInfo: (state: PermissionTy, data: boolean) => {
    state.isGetUserInfo = data
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
