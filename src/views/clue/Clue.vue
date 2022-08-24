<template>
  <div class="Clue">
    <div class="header_">
      <div
        class="menu"
        v-for="m in menus"
        :style="{ backgroundColor: m.status === queryInfo.status ? '#FFBF00' : '#409EFF' }"
      >
        <div class="content" @click="changeMenu(m.status)">
          <i
            :class="'fontFamily ' + m.icon"
            :style="{ color: m.status === queryInfo.status ? '#FFBF00' : '#409EFF' }"
          ></i>
          <span>{{ m.name }}</span>
          <b :style="{ color: m.status === queryInfo.status ? '#FFBF00' : '#409EFF' }">{{ m.num }}</b>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="btn">
        <el-button type="primary" plain @click="addVisible = true">新建呈批</el-button>
      </div>
      <batchTable :batchList="batchList" :queryInfo="queryInfo" />

      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        @current-change="getBatch()"
        :total="total"
        v-model:current-page="queryInfo.pageNum"
        :page-size="queryInfo.pageSize"
        style="position: fixed; bottom: 40px; right: 20px"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Clue'
}
</script>

<script setup lang="ts">
import { reactive, getCurrentInstance, watch, ref, toRefs } from 'vue'
import { queryLeader } from '@/api/submitBatchForm'
import batchTable from '@/components/batchList/'

import { ObjTy } from '@/types/common'
let { proxy }: any = getCurrentInstance()
let state: ObjTy = reactive({
  queryInfo: {
    status: 'wait',
    flag: 'nowYear',
    pageNum: 1,
    pageSize: 10,
    status: 'wait',
    search: '',
    priority: '',
    batchformCategory: '',
    year: ''
  },
  batchList: [],
  batchVisible: false,
  total: 0,
  groupRadio: 'bf_04', // 新建呈批单选按钮
  addVisible: false, // 新建呈批弹出框
  menus: [
    {
      name: '待办审批',
      status: 'wait',
      num: 0,
      icon: 'el-icon-jw-order-incomplete'
    },
    {
      name: '已办审批',
      status: 'done',
      num: 0,
      icon: 'el-icon-jw-icon_xuncharenwuyiban'
    }
  ]
})

function changeMenu(val: string) {
  state.queryInfo.status = val
  getBatch()
}

async function getBatch() {
  state.queryInfo.title = state.queryInfo.search
  state.queryInfo.start = (state.queryInfo.pageNum - 1) * state.queryInfo.pageSize
  const res = await queryLeader(state.queryInfo)
  if (res.success) {
    state.batchList = res.data.list
    setIndex(state.batchList)
    if (res.data.list.length === 0 && state.queryInfo.pageNum !== 1) {
      state.queryInfo.pageNum--
      getBatch()
    }
    if (state.queryInfo.status === 'wait') {
      state.total = res.data.waitTotal
    } else {
      state.total = res.data.doneTotal
    }
    if (!state.queryInfo.search) {
      state.menus[0].num = res.data.waitTotal
      state.menus[1].num = res.data.doneTotal
    }
  }
}

function setIndex(list: Array<ObjTy>) {
  list.forEach((item: ObjTy, i: number) => {
    item.index = i + (state.queryInfo.pageNum - 1) * state.queryInfo.pageSize + 1
  })
}

getBatch()
let { menus, queryInfo, addVisible, batchList, total } = toRefs(state)
</script>

<style lang="less" scoped>
.Clue {
  > .header_ {
    display: flex;
    align-items: center;
    height: 100px;
    padding: 0 20px;
    background-color: #fff;

    .menu {
      width: 200px;
      height: 80px;
      margin-right: 35px;
      border-radius: 8px;

      .content {
        position: relative;
        width: calc(100% - 10px);
        height: 100%;
        line-height: 80px;
        margin-left: 10px;
        padding: 10px 16px;
        border-radius: 8px;
        background-color: #fff;
        border: 1px solid #b3b3b3;
        border-left: 0px;
        overflow: hidden;
        cursor: pointer;

        i {
          font-size: 40px;
          color: #409eff;
        }

        span {
          position: absolute;
          top: 16px;
          right: 20px;
          font-size: 18px;
          line-height: 20px;
        }

        b {
          position: absolute;
          bottom: 14px;
          left: 99px;
          font-size: 20px;
          line-height: 20px;
          color: #409eff;
        }

        &::before {
          content: '';
          position: absolute;
          left: 75px;
          top: 20px;
          height: 40px;
          width: 1px;
          background-color: #bbb;
        }
      }
    }
  }

  > .content {
    margin-top: 12px;
    padding: 0 16px;
    background-color: #fff;
    height: calc(100vh - 210px);

    .btn {
      padding: 0 20px;
      line-height: 70px;
    }
  }
}

.radio_class {
  > .el-radio {
    display: block;
    margin: 30px;
  }

  :deep(.el-radio__label) {
    font-size: 20px;
  }
}
</style>
