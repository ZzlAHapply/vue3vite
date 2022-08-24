import request from '@/utils/axiosReq'
import { ObjTy } from '@/types/common'

// 批量已阅
export function updateWaitConsult(data: ObjTy) {
  return request({
    url: 'petition/updateWaitConsult.do',
    method: 'post',
    data
  })
}

// 签收
export function sign(data: ObjTy) {
  return request({
    url: '/petition/sign.do',
    method: 'post',
    data
  })
}

// xf件更新(分办,退回,留档,绑定呈批)
export function update(data: ObjTy) {
  return request({
    url: 'petition/update.do',
    method: 'post',
    data
  })
}
