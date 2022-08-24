import request from '@/utils/axiosReq'
import { ObjTy } from '@/types/common'

// 查询线索数据(分页)
export function findClueByPaging(data: ObjTy, flag?: boolean) {
  return request({
    url: 'clue/findClueByPaging.do',
    method: 'post',
    bfLoading: !flag,
    data
  })
}

// 查询线索数据num
export function findClueByPagingCount(data: ObjTy, flag?: boolean) {
  return request({
    url: 'clue/findClueByPagingCount.do',
    method: 'post',
    data
  })
}

// 查询xf数据(分页)
export function findPetitionByPaging(data: ObjTy, flag?: boolean) {
  return request({
    url: '/clue/findPetitionByPaging.do',
    method: 'post',
    bfLoading: !flag,
    data
  })
}

// 查询预警提醒
export function findRemindByPaging(data: ObjTy, flag?: boolean) {
  return request({
    method: 'post',
    url: 'clue/findRemindByPaging.do',
    bfLoading: true,
    data
  })
}

// 获取当前时间
export function getCurrentTime() {
  return request({
    url: 'clue/getCurrentTime.do',
    method: 'get',
    bfLoading: false
  })
}

// 验证线索编码
export function isEmptyImportClueCode(clueCode: string) {
  return request({
    url: 'clue/isEmptyImportClueCode.do',
    method: 'get',
    isParams: true,
    data: {
      clueCode
    }
  })
}

// 签收
export function signOtherBranch(data: ObjTy) {
  return request({
    url: '/clue/signOtherBranch.do',
    method: 'post',
    data
  })
}

// 线索单独给号
export function clueOfferNumber(data: ObjTy) {
  return request({
    url: 'clue/clueOfferNumber.do',
    method: 'post',
    data
  })
}

// 将暂存线索转为待办
export function clueRestart(data: ObjTy) {
  return request({
    url: 'clue/clueRestart.do',
    method: 'post',
    data
  })
}
