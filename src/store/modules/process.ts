import { ObjTy } from '@/types/common'
import { ProcessTy } from '@/types/store'

const state = {
  params: {
    // 打开检举控告件、线索页面时的数据
    clueId: '', // 表单查询的id
    edit: false, // 是否允许编辑
    next: '', // 当前路由 用来返回
    menu: '', // 打开时的子菜单
    type: ''
  },
  batch: {
    // 打开呈批单的数据
    id: '', // 呈批id
    edit: true, // 是否编辑
    type: 'bf_01', // 呈批类型
    menu: '', // 打开的菜单
    menu2: '', // 打开的子菜单
    dataInfo: {}, // 线索信息
    clueId: '',
    next: ''
  },
  history: []
}

const mutations = {
  setParams: (state: ProcessTy, val: any) => {
    state.params = val
    sessionStorage.setItem('params', JSON.stringify(val))
  },
  setParamsEdit: (state: ProcessTy, val: boolean) => {
    state.params.edit = val
    sessionStorage.setItem('params', JSON.stringify(state))
  },
  setParamsMenu: (state: ProcessTy, val: string) => {
    state.params.menu = val
    sessionStorage.setItem('params', JSON.stringify(state))
  },
  setBatch: (state: ProcessTy, val: any) => {
    state.batch = val
  },
  setHistory: (state: ProcessTy, val: any) => {
    if (val === 'clear') {
      state.history = []
    } else if (val === 'del') {
      if (state.history.length > 1) {
        state.history.splice(state.history.length - 1, 1)
      } else {
        state.history = []
      }
    } else {
      state.history.push(val)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
