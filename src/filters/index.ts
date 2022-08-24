import { CategoryMap } from './CategoryMap'
import { ObjTy } from '@/types/common'

function dictConversion(dictCode: string, json: Array<ObjTy>, otherName: string | undefined) {
  for (let i = 0; i < json.length; i++) {
    if (dictCode === json[i].code) {
      let str: any = otherName ? json[i].otherName : json[i].name
      return str
    } else {
      if (json[i].children) {
        let result: any = dictConversion(dictCode, json[i].children, otherName)
        if (result) {
          return result
        }
      } else {
        if (json[i].children) {
          let result: any = dictConversion(dictCode, json[i].children, otherName)
          if (result) {
            return result
          }
        }
      }
    }
  }
  return null
}

function dictConversion2(dictCode: string, json: Array<ObjTy>, otherName: string | undefined) {
  for (let i = 0; i < json.length; i++) {
    if (dictCode === json[i].code) {
      return otherName ? json[i].otherName : json[i].name
    } else {
      if (json[i].children) {
        let result = dictConversion(dictCode, json[i].children, otherName)
        if (result) {
          return result
        }
      } else {
        if (json[i].children) {
          let result = dictConversion(dictCode, json[i].children, otherName)
          if (result) {
            return result
          }
        }
      }
    }
  }
  return dictCode
}

export function formatCode(str: string, otherName?: string) {
  return dictConversion(str, CategoryMap, otherName)
}

export function formatCode2(str: string, otherName?: string) {
  return dictConversion2(str, CategoryMap, otherName)
}

export function parseTime(time: any, cFormat: string) {
  // ios {y}-{m}-{d} {h}:{i}:{s} 会出现NAN， - 改成 /
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (!time) {
    date = new Date()
  } else if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: ObjTy = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

export function suffix(suffix: string) {
  let fileType
  if (
    suffix == 'doc' ||
    suffix == 'dot' ||
    suffix == 'wps' ||
    suffix == 'wpt' ||
    suffix == 'docx' ||
    suffix == 'dotx' ||
    suffix == 'docm' ||
    suffix == 'dotm'
  ) {
    fileType = 'w'
  } else if (
    suffix == 'xls' ||
    suffix == 'xlt' ||
    suffix == 'et' ||
    suffix == 'xlsx' ||
    suffix == 'xltx' ||
    suffix == 'xlsm' ||
    suffix == 'xltm'
  ) {
    fileType = 's'
  } else if (
    suffix == 'ppt' ||
    suffix == 'pptx' ||
    suffix == 'pptm' ||
    suffix == 'ppsx' ||
    suffix == 'ppsm' ||
    suffix == 'pps' ||
    suffix == 'potx' ||
    suffix == 'potm' ||
    suffix == 'dpt' ||
    suffix == 'dps'
  ) {
    fileType = 'p'
  }
  // else if (suffix == "pdf") {
  //   fileType = "f";
  // }
  else {
    fileType = ''
  }
  return fileType
}
