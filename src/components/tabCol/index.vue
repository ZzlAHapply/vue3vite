<template>
  <el-table-column
    v-for="(c, i) in colS"
    :key="i + 4"
    :label="c.label2"
    :prop="c.prop2"
    :sortable="c.sortable2 || false"
    :min-width="c.w2 || ''"
    show-overflow-tooltip
  >
    <template #default="{ row }">
      <slot v-if="c.slot" :name="c.prop2" :row="row" :value="formatter2(row, c.prop2)" />
      <template v-else>
        {{ formatter2(row, c.prop2) }}
      </template>
    </template>
  </el-table-column>
</template>
<script lang="ts">
export default {
  name: 'tabCol'
}
</script>

<script setup lang="ts">
import { getCurrentInstance, computed, reactive, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ObjTy } from '@/types/common'
import { parseTime, formatCode } from '@/filters'
let { proxy }: any = getCurrentInstance()
const store = useStore()

const props = defineProps({
  labels: {
    type: Array,
    default: () => {
      return [
        // {
        /**
         * @label2  { String } 对应label
         * @prop2   { String }
         * @w2      { String } width
         * @show    { Boolean } true为不显示
         * @slot    { Boolean } true为开启插槽
         */
        // }
        {
          label2: '线索编号',
          prop2: 'clueCode',
          w2: '120'
        },
        {
          label2: '被反映人',
          prop2: 'persons',
          w2: '110'
        },
        {
          label2: '单位及职务',
          prop2: 'workUnit',
          w2: '120'
        },
        {
          label2: '职级详情',
          prop2: 'data.persons.rankDetail',
          w2: '90'
        },
        {
          label2: '线索来源',
          prop2: 'data.clueSource',
          w2: '120'
        },
        {
          label2: '当前部门',
          prop2: 'allowBranchName',
          w2: '150'
        },
        {
          label2: '当前承办人',
          prop2: 'ownerName2',
          w2: '80'
        },
        {
          label2: '当前处置方式',
          prop2: 'data.ownerStatus.name',
          w2: '90'
        },
        {
          label2: '处置结果',
          prop2: 'handleResult',
          w2: '80'
        }
      ]
    }
  },
  menuType: {
    type: String,
    default: ''
  }
})

let colS = computed(() => {
  let list = props.labels.filter((item: ObjTy) => {
    return !item.show
  })
  return list
})

function clueCode(row: ObjTy, val: String, length?: boolean) {
  let code = val || store.getters.branchParentInnerCode
  let i: any = length || 8
  if (store.getters.branchType === 'CadreSupervisoryBranch') {
    if (code.length === i) {
      return row.provinceGJCode
    } else if (code.length === i + 4) {
      return row.cityGJCode
    } else {
      return row.countyGJCode
    }
  } else {
    if (code.length === i) {
      return row.provinceCode
    } else if (code.length === i + 4) {
      return row.cityCode
    } else {
      return row.countyCode
    }
  }
}

function formatter2(row: ObjTy, flag: string) {
  if (!row.data) return ''
  let data: any = {
    index: () => {
      return row.index
    },
    persons: () => {
      // 被反映人
      let str = ''
      row.data.persons.forEach((item: ObjTy, i: number) => {
        str += item.personName
        if (row.data.persons.length - 1 !== i) {
          str += ', '
        }
      })
      return str
    },
    clueTitle: () => {
      // 标题
      return row.data.clueTitle
    },
    workUnit: () => {
      // 单位及职务
      if (row.data.persons && row.data.persons.length > 0) {
        return (
          (row.data.persons[0].workUnit || '') +
          (row.data.persons[0].workUnit ? '； ' : '') +
          (row.data.persons[0].dutyName || '')
        )
      }
      return ''
    },
    firstRank: () => {
      // 职务
      if (row.data.persons && row.data.persons.length > 0) {
        let data = row.data.persons[0].firstRank || row.data.persons[0].rankName
        return formatCode(data) || data
      }
      return ''
    },
    ownerName: () => {
      // 转来人员
      return row.ownerName
    },
    ownerBranchName: () => {
      // 转来部门
      return row.ownerBranchName
    },
    transferDate: () => {
      // 转来时间
      return row.transferDate ? parseTime(row.transferDate, '{y}-{m}-{d}') : ''
    },
    clueCode: () => {
      // 编号
      let code = props.menuType === 'owner' ? row.ownerBranchInnerCode : ''
      let i: any = props.menuType === 'owner' ? 12 : ''
      return clueCode(row, code, i)
    },
    'data.persons.rankDetail': () => {
      // 职级详情
      let data = row.data.persons && row.data.persons.length > 0 ? row.data.persons[0].rankDetail : ''
      return formatCode(data) || data
    },
    'data.clueSource': () => {
      // 线索来源
      let code = store.getters.branchParentInnerCode
      let i = 8
      let clueSource = ''
      if (props.menuType === 'owner') {
        code = row.ownerBranchInnerCode
        i = 12
      }
      let list =
        code.length === i
          ? row.data.provinceClueSource
          : code.length === i + 4
          ? row.data.cityClueSource
          : row.data.countyClueSource
      for (let i = 0; i < list.length; i++) {
        if (i === list.length - 1) {
          clueSource = clueSource + formatCode(list[i])
        } else {
          clueSource = clueSource + formatCode(list[i]) + ','
        }
      }
      return clueSource
    },
    'data.clueType': () => {
      // 线索类型
      return row.data.clueType
    },
    allowBranchName: () => {
      // 当前部门
      let val = row.ownerArea && row.ownerArea !== null ? row.ownerArea : ''
      if (row.provinceToCity === '1' || row.cityToCounty === '1') {
        // 下级转上来的
        val += '(' + row.ownerArea + ')' + (row.allowBranchName ? row.allowBranchName : row.ownerBranchName)
      } else if (row.allowBranchName) {
        val += row.allowBranchName
      } else {
        val += row.ownerBranchName
      }
      return val
    },
    ownerName2: () => {
      // 当前承办人
      if (row.allowBranchName && props.menuType !== 'overtime') {
        return row.allowUserName
      } else {
        return row.ownerName
      }
    },
    allowUserName: () => {
      // 后续承办人
      let str = ''
      if (row.allowBranchName) {
        str = row.allowUserName || ''
      } else {
        str = row.ownerName || ''
      }
      if (row.data.accreditFlag) {
        // 派驻线索是否签收
        if (row.data.accreditFlag === '2') {
          str += '(未签收)'
        } else if (row.data.accreditFlag === '1') {
          str += '(已签收)'
        }
      }
      return str
    },
    'data.problemIntro': () => {
      // 主要问题线索
      return row.data.problemIntro
    },
    'data.reflectName': () => {
      // 反映人
      let val = row.data.reflectName
      if (row.data.wbType === 'report_type_493') {
        val = '匿名举报'
      }
      return val
    },
    transferUnit: () => {
      // 外单位名称
      return row.data.transferUnit
    },
    allowDate: () => {
      // 当前部门办理天数
      let date = row.allowDate ? row.allowDate : row.ownerDate
      if (date) {
        let time1 = new Date(date.split(' ')[0]).getTime()
        let time2 = new Date(row.clueEndDate || store.getters.nowTime).getTime()
        if (time2 - time1) {
          return Math.ceil((time2 - time1) / 1000 / 60 / 60 / 24) + ' 天'
        } else {
          return '1 天'
        }
      }
      return ''
    },
    caseManageDate: () => {
      // 案管分办时间
      let date = row.data.petitionDate ? '' : row.data.caseManageDate
      return date
    },
    petitionDate: () => {
      // xf转办时间
      return row.data.petitionDate
    },
    signDate: () => {
      // 签收时间
      return row.signDate
    },
    ownerDate: () => {
      // 本部门已办时间
      try {
        let date =
          row.allowDate || row.ownerDate || row.signDate || row.transferDate || row.registerDate || row.date || ''
        date = date.split(' ')[0]
        if (date) {
          let time1 = new Date(date).getTime()
          let time2 = new Date(store.getters.nowTime).getTime()
          if (time2 - time1) {
            return Math.ceil((time2 - time1) / 1000 / 60 / 60 / 24) + ' 天'
          } else {
            return '1 天'
          }
        }
      } catch (err) {
        return ''
      }
    },
    'data.exportConfirmDate': () => {
      // 6.0包导出时间
      return row.data.exportConfirmDate || ''
    },
    'data.ownerStatus.name': () => {
      // 当前处置方式
      if (row.data.ownerStatus.name) {
        return row.data.ownerStatus.name
      } else {
        if (row.data.ownerStatus.status == 'start') {
          if (row.data.persons && row.data.persons.length > 0 && row.data.persons[0].fiveHandlerWay) {
          }
          return '暂存待查'
        } else if (row.data.ownerStatus.status == 'end') {
          return '了结'
        }
      }
    },
    handleResult: () => {
      // 处置结果
      let p = row.data.persons
      if (p && p.length > 0 && p[0].fiveHandlerWay && p[0].fiveHandlerWay.length > 0) {
        return p[0].fiveHandlerWay[p[0].fiveHandlerWay.length - 1].handleResult
      }
      return ''
    },
    'data.isRepeat': () => {
      // 重复件
      if (row.data.isRepeat === '1') {
        return '是'
      } else return '否'
    },
    title: () => {
      // xf标题（xf）
      return row.data.title
    },
    petitionCode: () => {
      // xf编号（xf）
      return row.data.petitionId || row.data.id
    },
    orgName: () => {
      // 工作单位及职务（xf）
      let data = getFirstPerson(row.data.persons) || {}
      return (data.orgName || '') + (data.dutyName || '')
    },
    rankName: () => {
      // 职级（xf）
      let data1 = getFirstPerson(row.data.persons) || {}
      let data = formatCode(data1.rankName)
      return data || data1.rankName
    },
    orgName2: () => {
      // 工作单位及职务（xf）
      return (row.data.reporters[0].personAreaName || '') + (row.data.reporters[0].dutyName || '')
    },
    rankName2: () => {
      // 职级（xf）
      let data = formatCode(row.data.reporters[0].rankName)
      return data || row.data.reporters[0].rankName
    },
    petitionStatus: () => {
      // 办理状态（xf）
      let data: ObjTy = {
        registered: '未签收',
        transfer: '待签收',
        record: '留存归档',
        end: '转问题线索',
        merge: '已合并',
        recycled: '已退回xf',
        notAccepted: '不予受理',
        maintain: '维持处分',
        change: '变更处分',
        revoke: '撤销处分',
        endAppeal: '终止申诉'
      }
      try {
        let s: string = data[row.status]
        if (s === '待签收') {
          if (row.allowBranchInnerCode === store.getters.branchInnerCode) {
            return '待签收'
          } else {
            return '办理中'
          }
        }
        return s || '办理中'
      } catch (error) {
        return '办理中'
      }
    },
    petitionTransfer: () => {
      // 转来人员（xf）
      if (row.allowUserName || row.allowBranchName) {
        if (
          row.allowUserName === store.getters.personName ||
          row.allowBranchInnerCode === store.getters.branchInnerCode
        ) {
          return row.ownerName
        } else return row.data.handlerName
      } else if (row.acceptUserId === row.ownerId && row.historyOperators && row.historyOperators.length < 2) {
        return row.data.handlerName
      } else return row.handlerName || row.acceptUserName
    },
    reporters: () => {
      // 申诉人（xf）
      let str = ''
      row.data.reporters.forEach((item: ObjTy, i: Number) => {
        str += item.personName
        if (row.data.reporters.length - 1 !== i) {
          str += ', '
        }
      })
      return str
    },
    managDept: () => {
      // 办理部门（xf）
      return (row.ownerArea || '') + (row.allowBranchName || row.ownerBranchName || row.reciveDeptName)
    },
    isBasic: () => {
      // 转办基层（xf）
      return row.isBasic === '1' ? '是' : ''
    },
    managName: () => {
      // 办理人员（xf）
      if (row.allowBranchName) {
        return row.allowUserName
      }
      return row.allowUserName || row.ownerName || row.reciveName
    },
    registerOccurTime: () => {
      // xf转办时间（xf）
      return parseTime(row.registerOccurTime, '{y}-{m}-{d}')
    },
    supDate: () => {
      // 上级转办时间（xf）
      return row.superiorTransferDate
    },
    acceptDate: () => {
      // 室签收时长（xf）
      formatterHandleDate(row)
    },
    ownerTime: () => {
      // 本部门已办时间（xf）
      let date = row.superiorTransferDate || row.registerOccurTime
      date = date.split(' ')[0]
      if (date) {
        let time1 = new Date(date).getTime()
        let time2 = new Date(store.getters.nowTime).getTime()
        if (time2 - time1) {
          return Math.ceil((time2 - time1) / 1000 / 60 / 60 / 24) + ' 天'
        } else {
          return '1 天'
        }
      }
      return ''
    }
  }
  try {
    return data[flag]()
  } catch (err) {
    console.log(err)
    return ''
  }
}
function getFirstPerson(val: Array<ObjTy>) {
  let data: any = ''
  val.forEach((item) => {
    if (item.personNo && item.personNo === '1') {
      data = item
    }
  })
  return data || (val.length > 0 ? val[0] : {})
}
function formatterHandleDate(row: ObjTy, flag?: any) {
  let now = new Date(row.acceptDate).getTime()
  if (!row.acceptDate && flag !== 2) {
    // 未签收
    now = new Date(store.getters.nowTime).getTime()
    let b = new Date(row.registerOccurTime).getTime()
    if (now - b) {
      return Math.ceil((now - b) / 1000 / 60 / 60 / 24) + ' 天未签收'
    } else {
      return '1 天未签收'
    }
  } else if (flag === 2) {
    //
    now = new Date(store.getters.nowTime).getTime()
  }
  let befor = new Date(row.registerOccurTime).getTime()
  if (row.handleDate) {
    now = new Date(row.handleDate).getTime()
  }
  if (now - befor) {
    return Math.ceil((now - befor) / 1000 / 60 / 60 / 24) + ' 天'
  } else {
    return '1 天'
  }
}
</script>
