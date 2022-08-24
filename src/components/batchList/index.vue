<template>
  <div class="batchList">
    <el-table tooltip-effect="dark" :data="batchList" @row-dblclick="proxy.$emit('dblclick')" :height="props.height">
      <el-table-column label="操作" width="200" :key="1">
        <template #default="{ row }">
          <el-button
            v-for="item in tableBtn(row)"
            :key="item.name"
            size="mini"
            :type="item.type || 'primary'"
            @click="item.handler(row)"
          >
            {{ item.name }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="序号" prop="index" width="60" :key="2" />
      <el-table-column label="审签单标题" prop="title" show-overflow-tooltip :key="3" />
      <el-table-column label="呈报部门" prop="hostingdepartment" width="180" show-overflow-tooltip :key="4" />
      <el-table-column label="呈报人" prop="operator" width="180" show-overflow-tooltip :key="5" />
      <el-table-column label="呈报时间" show-overflow-tooltip width="220">
        <template #default="{ row }">
          {{ proxy.$momentMini(row.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="后续办理人" prop="nextUserName" width="200" show-overflow-tooltip :key="6">
        <template #default="{ row }">
          {{
            row.batchFormStatus === 'end' ? '已结束' : row.batchFormStatus === 'cancel' ? '已报废' : row.nextUserName
          }}
        </template>
      </el-table-column>
      <el-table-column label="签批时间" show-overflow-tooltip width="220" :key="7">
        <template #default="{ row }">
          {{ proxy.$momentMini(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
export default {
  name: 'batchList'
}
</script>

<script setup lang="ts">
import { reactive, getCurrentInstance, watch, ref, toRefs } from 'vue'

import { ObjTy } from '@/types/common'
let { proxy }: any = getCurrentInstance()
let state: ObjTy = reactive({})

const props = defineProps({
  height: {
    type: String,
    default: '600px'
  },
  batchList: {
    type: Array
  },
  queryInfo: {
    type: Object
  }
})

function tableBtn(row: ObjTy) {
  /**
   * @disabled {boolean} 禁用
   * @handler  {function} 方法
   * @name     {String} 名字
   * @type     {warning | success | info | warning | danger}
   * @show     {boolean} true为不显示！
   */
  let list = []

  list = [
    {
      name: props.queryInfo?.status === 'done' ? '查看' : row.isSign === 'N' ? '签收' : '办理',
      handler(row: ObjTy) {
        proxy.handle(row, 'btn')
      }
    },
    {
      name: '补正',
      handler(row: ObjTy) {
        proxy.handle(row, 'btn')
      },
      show: !(row.isCorrection === '1')
    },
    {
      name: '撤回',
      handler(row: ObjTy) {
        proxy.sendBack(row)
      },
      type: 'warning',
      show: !(
        row.isBack == 'Y' &&
        row.batchFormStatus !== 'end' &&
        row.batchFormStatus !== 'cancel' &&
        row.status === 'done'
      )
    },
    {
      name: '退回',
      handler(row: ObjTy) {
        state.sendBack(row, 'back')
      },
      type: 'warning',
      show: !(row.status === 'wait' && row.isSign === 'N')
    }
  ]

  return list.filter((item) => {
    return !item.show
  })
}

function handle(row: ObjTy) {}
function sendBack(row: ObjTy) {}
</script>

<style lang="less" scoped>
.batchList {
}
</style>
