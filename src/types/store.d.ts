/*vuex ts*/
import { RouterTy } from '@/types/router'

interface StateTy {
  app: AppTy
  permission: PermissionTy
  user: UserTy
  process: ProcessTy
}

interface UserTy {
  username: string
  avatar: string
  roles: Array<string>
  token: string
  personName: string
  userName: string
  avatar: string
  branchName: string
  branchType: string
  branchInnerCode: string
  branchParentName: string
  branchParentInnerCode: string
  menus: Array<Object>
  priv: string
  nowTime: string
}

interface AppTy {
  sidebar: {
    opened: boolean
    //opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    // withoutAnimation: false
  }
  device: 'desktop'
  cachedViews: Array<string>
}
interface PermissionTy {
  isGetUserInfo: boolean //是否已经设置了权限
  routes: RouterTy //将过滤后的异步路由和静态路由集合
  addRoutes: RouterTy //过滤后的异步路由
}

interface ProcessTy {
  params: {
    clueId: string // 表单查询的id
    edit: boolean // 是否允许编辑
    next: string // 当前路由 用来返回
    menu: string // 打开时的子菜单
    type: string
  }
  batch: {
    id: string // 呈批id
    edit: boolean // 是否编辑
    type: string // 呈批类型
    menu: string // 打开的菜单
    menu2: string // 打开的子菜单
    dataInfo: Object // 线索信息
    clueId: string
    next: string
  }
  history: Array<string>
}
