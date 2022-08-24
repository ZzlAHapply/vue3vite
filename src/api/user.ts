import request from '@/utils/axiosReq'
import { ObjTy } from '@/types/common'

export function loginReq(data: ObjTy) {
  return request({
    url: '/rest/user/login.do',
    data,
    method: 'post',
    bfLoading: false,
    isAlertErrorMsg: false
  })
}

export function getInfoReq() {
  return request({
    url: '/rest/user/info.do',
    bfLoading: false,
    isParams: true,
    isAlertErrorMsg: false,
    method: 'get',
    data: {}
  })
}

export function logoutReq() {
  return request({
    url: '/rest/user/logout.do',
    method: 'post',
    isAlertErrorMsg: false
  })
}
