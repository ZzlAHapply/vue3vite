import request from '@/utils/axiosReq'
import { ObjTy } from '@/types/common'

// 获取呈批单列表
export function queryLeader(data: ObjTy, flag?: boolean) {
  return request({
    url: '/submitBatchForm/queryLeader.do',
    method: 'post',
    data
  })
}

// 更新呈批表单签收状态
export function updateSign(id: string) {
  return request({
    url: 'submitBatchForm/updateSign.do',
    method: 'post',
    isParams: true,
    data: {
      id
    }
  })
}
