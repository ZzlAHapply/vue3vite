import request from '@/utils/axiosReq'
import { ObjTy } from '@/types/common'

// 查询传阅列表
export function findCirculated(data: ObjTy) {
  return request({
    url: '/correction/findCirculated.do',
    method: 'POST',
    data
  })
}
