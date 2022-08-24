import { loginReq, logoutReq, getInfoReq } from '@/api/user'
import { getCurrentTime } from '@/api/clue'
import { setToken, removeToken, getToken } from '@/utils/auth'
import { ObjTy } from '@/types/common'
import { UserTy } from '@/types/store'
//token: getToken(),

const getDefaultState = () => {
  return {
    token: getToken(),
    avatar: '',
    personName: '',
    username: '',
    branchName: '',
    branchType: '',
    branchInnerCode: '',
    branchParentName: '',
    branchParentInnerCode: '',
    priv: '',
    roles: [],
    menus: [],
    nowTime: ''
  }
}

const state = getDefaultState()

const mutations = {
  M_username: (state: UserTy, username: string) => {
    state.username = username
  },
  M_roles: (state: UserTy, roles: Array<string>) => {
    state.roles = roles
  },
  SET_TOKEN: (state: UserTy, token: string) => {
    state.token = token
  },
  SET_NAME: (state: UserTy, name: string) => {
    state.personName = name
  },
  SET_USERNAME: (state: UserTy, userName: string) => {
    state.userName = userName
  },
  SET_AVATAR: (state: UserTy, avatar: string) => {
    state.avatar = avatar
  },
  SET_BRANCH_NAME: (state: UserTy, branchName: string) => {
    state.branchName = branchName
  },
  setBranchType: (state: UserTy, branchType: string) => {
    state.branchType = branchType
  },
  SET_BRANCH_INNER_CODE: (state: UserTy, branchInnerCode: string) => {
    state.branchInnerCode = branchInnerCode
  },
  SET_BRANCH_PARENT_NAME: (state: UserTy, branchParentName: string) => {
    state.branchParentName = branchParentName
  },
  SET_BRANCH_PARENT_INNER_CODE: (state: UserTy, branchParentInnerCode: string) => {
    state.branchParentInnerCode = branchParentInnerCode
  },
  SET_PRIV: (state: UserTy, priv: string) => {
    state.priv = priv
  },
  SET_MENUS: (state: UserTy, menus: Array<ObjTy>) => {
    state.menus = menus
  },
  SET_nowTime: (state: UserTy, nowTime: string) => {
    state.nowTime = nowTime
  }
}

const actions = {
  // user login
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login({ commit }: ObjTy, data: ObjTy) {
    return new Promise((resolve, reject) => {
      loginReq(data)
        .then((res: ObjTy) => {
          if (res.statusCode === '20000') {
            //commit('SET_Token', res.data?.jwtToken)
            setToken(res.data?.token)
            resolve(null)
          } else {
            reject(res)
          }
        })
        .catch((error: any) => {
          reject(error)
        })
    })
  },
  // get user info
  getInfo({ commit }: ObjTy) {
    return new Promise((resolve, reject) => {
      getInfoReq()
        .then((response: ObjTy) => {
          const { data } = response
          commit('SET_NAME', data.name)
          commit('M_roles', data.roles)
          commit('SET_USERNAME', data.username)
          commit('SET_BRANCH_NAME', data.branchName)
          commit('setBranchType', data.branchType)
          commit('SET_BRANCH_INNER_CODE', data.branchInnerCode)
          commit('SET_BRANCH_PARENT_NAME', data.branchParentName)
          commit('SET_BRANCH_PARENT_INNER_CODE', data.branchParentInnerCode)

          let menus = JSON.parse(data.menus)
          let testMenus = [
            {
              path: '/',
              innerCode: '001',
              component: 'Layout'
            }
          ]
          testMenus.forEach((menu) => {
            menus.push(menu)
          })
          let router = buildRoutesFromMenus(menus)
          data.router = router
          commit('SET_MENUS', router)
          resolve(data)
        })
        .catch((error: any) => {
          console.log(error)
          reject(error)
        })
    })

    function buildRoutesFromMenus(flatMenus: Array<ObjTy>) {
      let routes = []
      let routerMap: ObjTy = {}
      for (let i = 0; i < flatMenus.length; i++) {
        let flatMenu = flatMenus[i]
        let flatMenuParentInnerCode: string = flatMenu.parentInnerCode
        let parentRoute = routerMap[flatMenuParentInnerCode]
        let route = buildRoute(flatMenu, !parentRoute)
        if (parentRoute) {
          if (parentRoute.children.length === 0) {
            parentRoute.redirect = route.path
          }
          parentRoute.children.push(route)
        } else {
          routes.push(route)
        }
        routerMap[flatMenu.innerCode] = route
      }
      routes[0].path = '/'
      return routes
    }

    function buildRoute(menu: ObjTy, isTop: boolean) {
      return {
        path: '/' + menu.url,
        component: isTop ? 'Layout' : menu.url,
        // redirect: '',
        name: menu.code,
        // hidden: true,
        // 需要登录才能进入的页面可以增加一个meta属性
        meta: {
          requireAuth: true,
          menuDisplay: 'second',
          title: menu.name,
          icon: menu.iconClass
        },
        children: []
      }
    }
  },
  // user logout
  logout() {
    return new Promise((resolve, reject) => {
      logoutReq()
        .then(() => {
          removeToken() // must remove  token  first
          // resetRouter()
          resolve(null)
        })
        .catch((error: any) => {
          reject(error)
        })
    })
  },
  // remove token
  resetToken() {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      resolve(null)
    })
  },
  getNowTime({ commit }: ObjTy) {
    return new Promise((resolve, reject) => {
      getCurrentTime()
        .then((res: ObjTy) => {
          commit('SET_nowTime', res.data)
          resolve(null)
        })
        .catch((error: ObjTy) => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
