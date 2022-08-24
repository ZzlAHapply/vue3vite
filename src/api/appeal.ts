import request from '@/utils/axiosReq'
import { ObjTy } from '@/types/common'

// 签收
export function sign(data: ObjTy) {
  return request({
    url: 'appeal/sign.do',
    method: 'post',
    data
  })
}

// 退回、撤回
export function returnAppeal(data: ObjTy) {
  return request({
    url: 'appeal/returnAppeal.do',
    method: 'post',
    data
  })
}
