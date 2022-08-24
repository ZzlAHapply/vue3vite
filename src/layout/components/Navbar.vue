<template>
  <div id="nav">
    <span @click="scroll('left')" :style="nextPlace <= 0 ? 'opacity: 0;' : ''">
      <svg-icon icon-class="zuojiantou" />
    </span>
    <ul ref="navRef">
      <li
        v-for="(menu, index) in menus"
        @click="clickTop(index, menu.path)"
        :class="{ cur: $route.path === menu.path }"
        :key="index"
      >
        <svg-icon :icon-class="menu.meta.icon" />
        <h4>{{ menu.meta.title }}</h4>
      </li>
    </ul>
    <span @click="scroll('right')" :style="!lastPlace ? 'opacity: 0;' : ''">
      <svg-icon icon-class="youjiant" />
    </span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Layout-navbar'
}
</script>

<script setup lang="ts">
import { getCurrentInstance, computed, reactive, ref, toRefs, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ObjTy } from '@/types/common'

const store = useStore()
let { proxy }: any = getCurrentInstance()

const state: ObjTy = reactive({
  nextPlace: 0,
  lastPlace: true,
  tabStyle: '/clue'
})

onMounted(() => {
  scrollInit()
})

// 菜单
const menus = computed(() => {
  return store.getters.addRoutes[0].children
})

// 点击菜单
let clickTop = (i: Number, url: string) => {
  state.tabStyle = url
  proxy.$router.push(url)
}

let navRef: any = ref(null)

// 点击两侧滚动
let scroll = (val: string) => {
  let nowPlace = navRef.value.scrollLeft
  let num = 0
  if (val === 'left') {
    num = navRef.value.scrollLeft - 100
  } else {
    num = navRef.value.scrollLeft + 100
  }
  if (num === state.nextPlace && num > 0) {
    state.lastPlace = false
  } else {
    state.lastPlace = true
    state.nextPlace = num
  }
  navRef.value.scrollTo({ left: state.nextPlace, behavior: 'smooth' })
}

// 监听鼠标滚动事件
let scrollInit = () => {
  // 添加滚轮滚动监听事件，一般是用下面的方法，上面的是火狐的写法
  navRef.value.addEventListener('mousewheel', handler, false)
  // 滚动事件的出来函数
  function handler(event: any) {
    // 获取滚动方向
    const detail = event.wheelDelta || event.detail
    // 定义滚动方向，其实也可以在赋值的时候写
    const moveForwardStep = 1
    const moveBackStep = -1
    // 定义滚动距离
    let step = 0
    // 判断滚动方向,这里的100可以改，代表滚动幅度，也就是说滚动幅度是自定义的
    if (detail < 0) {
      step = moveForwardStep * 100
    } else {
      step = moveBackStep * 100
    }
    // 对需要滚动的元素进行滚动操作
    navRef.value.scrollLeft += step
    if (navRef.value.scrollLeft === proxy.nextPlace && navRef.value.scrollLeft > 0) {
      proxy.lastPlace = false
    } else {
      proxy.lastPlace = true
      proxy.nextPlace = navRef.value.scrollLeft
    }
  }
}

let { lastPlace, nextPlace } = toRefs(state)
</script>

<style lang="less" scoped>
#nav {
  height: 90px;
  width: calc(100% - 1000px);
  margin-left: 30px;

  ::-webkit-scrollbar {
    display: none;
  }

  ul {
    float: left;
    height: 100%;
    width: calc(100% - 40px);
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    color: #fff;

    > li {
      height: 100%;
      min-width: 90px;
      text-align: center;
      margin-right: 10px;
      cursor: pointer;
      border-radius: 5px;

      h4 {
        font-size: 14px;
      }

      .svg-icon {
        height: 40px;
        margin-top: 15px;
        font-size: 50px;
      }

      &:hover {
        background-color: #07f;
      }
    }

    .cur {
      background-color: #07f;
    }
  }

  :deep(.el-badge__content.is-fixed) {
    top: 16px;
    right: 36px;
  }

  > span {
    float: left;
    width: 20px;
    height: 100%;
    color: #fff;
    text-align: center;
    line-height: 90px;
    cursor: pointer;

    &:hover {
      background-color: #07f;
    }
  }
}
</style>
