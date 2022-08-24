import { StateTy } from '@/types/store'

const getters = {
  device: (state: StateTy) => state.app.device,
  cachedViews: (state: StateTy) => state.app.cachedViews,
  addRoutes: (state: StateTy) => state.permission.addRoutes,
  menus: (state: StateTy) => state.user.menus,
  personName: (state: StateTy) => state.user.personName,
  roles: (state: StateTy) => state.user.roles,
  branchType: (state: StateTy) => state.user.branchType,
  branchParentInnerCode: (state: StateTy) => state.user.branchParentInnerCode,
  nowTime: (state: StateTy) => state.user.nowTime,
  params: (state: StateTy) => state.process.params,
  batch: (state: StateTy) => state.process.batch
}
export default getters
