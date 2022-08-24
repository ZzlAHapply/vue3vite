<template>
  <div class="form_temp" ref="formTempRef">
    <div class="clearfix header_">
      <span>{{ store.getters.params.title }}</span>
      <div class="title_">
        <slot name="title"></slot>
      </div>
      <el-button class="btn" type="text" @click="goBack()">关闭</el-button>
      <el-button v-if="store.getters.params.menu === 'merge'" class="btn" type="text" @click="goBack('merge')">
        <svg-icon icon-class="el-icon-jw-shouye" />
        返回
      </el-button>
    </div>
    <div class="container">
      <div class="aside" :style="{ flex: clientXNow }" :class="{ none: !showLeft }">
        <slot name="aside"></slot>
      </div>
      <div class="btn" @mousedown="moveCont">
        <span @mousedown.stop="() => {}" @click="showCont('left')" v-show="showRight">
          <svg-icon icon-class="el-icon-jw-zuobian" />
        </span>
        <span @mousedown.stop="() => {}" @click="showCont('right')" v-show="showLeft">
          <svg-icon icon-class="el-icon-jw-youbian" />
        </span>
      </div>

      <div class="section" :style="{ flex: clientX2Now }" :class="{ none: !showRight }">
        <slot name="main"></slot>
      </div>
      <div class="mark" v-show="showMark" :style="{ left: markPosition ? markPosition + 'px' : '' }"></div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'form_temp'
}
</script>
<script setup lang="ts">
import { getCurrentInstance, computed, reactive, ref, toRefs, onMounted } from 'vue'
import { useStore } from 'vuex'
import { updateWaitConsult } from '@/api/petition'
import Bus from '@/js/bus'

// import { PetitionTable, ClueTable, BatchTable, ClueMenus } from './components'
const emit = defineEmits(['reload'])
const store = useStore()
let { proxy }: any = getCurrentInstance()
let formTempRef = ref(null)
console.log(formTempRef)

console.log(proxy.$route)
console.log(store.getters.params)

let state = reactive({
  showLeft: true,
  showRight: true,
  clientX: '160',
  clientX2: '300',
  clientXNow: '160',
  clientX2Now: '300',
  moveNum: 0,
  showMark: false,
  markPosition: ''
})

function moveCont(el) {
  let clientWidth = formTempRef.value.clientWidth
  document.onmousemove = (e) => {
    state.showMark = true
    state.moveNum++
    if (state.moveNum > 2) {
      if (e.clientX < 300) {
        state.clientX = 300
        state.markPosition = 300
        state.clientX2 = clientWidth - 300
        document.onmousemove = null
        document.onmouseup = null
        state.showMark = false
        state.clientXNow = state.clientX
        state.clientX2Now = state.clientX2
        proxy.$message.warning('已经到最左边了，若您想继续请点击中间箭头按钮')
      } else if (clientWidth - e.clientX < 900) {
        state.clientX2 = 900
        state.clientX = clientWidth - 900
        state.markPosition = clientWidth - 900
        document.onmousemove = null
        document.onmouseup = null
        state.showMark = false
        state.clientXNow = state.clientX
        state.clientX2Now = state.clientX2
        proxy.$message.warning('已经到最右边了，若您想继续请点击中间箭头按钮')
      } else {
        state.clientX = e.clientX
        state.markPosition = e.clientX
        state.clientX2 = clientWidth - e.clientX
      }
      state.moveNum = 0
    }
  }
  document.onmouseup = (e) => {
    state.showMark = false
    state.clientXNow = state.clientX
    state.clientX2Now = state.clientX2
    document.onmousemove = null
    document.onmouseup = null
  }
}

function goBack(val) {
  if (val === 'merge') {
    let i = store.process.history
    store.commit('process/setParams', i[i.length - 1])
    if (proxy.$route.path.indexOf(i[i.length - 1].type) !== -1) {
      proxy.$emit('reload', i[i.length - 1].clueId)
      // Bus.$emit('closeMerge')
    } else {
      proxy.$router.push('/' + i[i.length - 1].type + 'Form')
    }
    setTimeout((_) => {
      store.commit('process/setHistory', 'del')
    }, 1)
  } else {
    proxy.$router.push(store.getters.params.next)
  }
}

function showCont(val) {
  if (val === 'left') {
    if (!state.showLeft) {
      state.showLeft = !state.showLeft
    } else {
      state.showRight = !state.showRight
    }
  } else {
    if (!state.showRight) {
      state.showRight = !state.showRight
    } else {
      state.showLeft = !state.showLeft
    }
  }
}

let { showLeft, showRight, clientX, clientX2, clientXNow, clientX2Now, moveNum, showMark, markPosition } = toRefs(state)
</script>
<style scoped lang="less">
.form_temp {
  > .header_ {
    background-color: #1548b1;
    padding: 0 20px;
    height: 58px;
    overflow: hidden;

    .btn {
      margin-left: 20px;
      float: right;
      padding: 3px 0;
      color: #fff;
      line-height: 52px;
    }

    .title_ {
      font-size: 14px;
      float: left;
      color: #fff;
      line-height: 58px;

      > span {
        display: inline-block;
        margin-left: 20px;
        min-width: 150px;

        > i {
          width: 25px;
          height: 25px;
          text-align: center;
          line-height: 25px;
          border-radius: 50%;
          border: 1px solid #fff;
        }
      }
    }
  }

  > .container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: calc(100vh - 60px);
    background-color: #eee;
    padding: 8px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    > .aside {
      flex: 2;
      width: 100%;
      height: 100%;
      padding-right: 8px;
      background-color: #fff;
      // transition: all 0.1s;
      border-radius: 8px;
      overflow: hidden;
      -moz-user-select: -moz-none;
      -moz-user-select: none;
      -o-user-select: none;
      -khtml-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      box-shadow: 3px 0px 2px #bbb;
    }

    > .section {
      flex: 3;
      width: 100%;
      height: 100%;
      padding-left: 8px;
      background-color: #fff;
      border-radius: 8px;
      // transition: all 0.1s;
      overflow: hidden;
      z-index: 2;
      box-shadow: -3px 0px 2px #bbb;
    }

    > .btn {
      width: 26px;
      position: relative;
      z-index: 3;

      &:hover {
        cursor: move;
      }

      span {
        position: absolute;
        width: 20px;
        height: 70px;
        line-height: 75px;
        text-align: center;
        background-color: #fff;
        cursor: pointer;
        -webkit-transition: all 0.8s;
        box-shadow: 3px 0px 2px #888;

        .svg-icon {
          color: #666;
          font-size: 20px;
        }
      }

      > :nth-child(1) {
        top: calc(50% - 100px);
        left: 0;
        border-left: 0;
        border-radius: 0 8px 8px 0;
      }

      > :nth-child(2) {
        top: calc(50% - 10px);
        right: 0;
        border-right: 0;
        border-radius: 8px 0 0 8px;
        box-shadow: -3px 0px 2px #888;
      }
      &:hover {
        span {
          transform: scale(1.2);
        }
      }
    }

    > .mark {
      position: absolute;
      top: 0;
      left: calc(40% - 8px);
      width: 26px;
      height: 100%;
      z-index: 2;
      border-left: 2px dashed #666;
      border-right: 2px dashed #666;
    }
  }
}

.none {
  flex: 0 !important;
  transition: all 0.5s;
}
</style>
