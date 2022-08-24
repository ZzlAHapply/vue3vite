<template>
  <div class="Layout">
    <div class="top">
      <div class="logo"></div>
      <Navbar />
      <Logout />
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Layout'
}
</script>

<script setup lang="ts">
import { Navbar, Logout } from './components'

import { useStore } from 'vuex'

const store = useStore()

store.dispatch('user/getNowTime')
</script>

<style lang="less" scoped>
.Layout {
  overflow: hidden;

  > .top {
    display: flex;
    justify-content: space-between;
    height: 90px;
    background: #1548b1;

    .logo {
      width: 800px;
    }
  }

  > .content {
    height: calc(100vh - 90px);
  }
}
</style>
