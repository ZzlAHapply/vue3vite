<template>
  <div class="layoutLogout">
    <p>{{ store.getters.personName }}</p>
    <span @click="logout">退出</span>
    <el-dropdown @command="command">
      <span class="el-dropdown-link">
        帮助
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="help">通知信息</el-dropdown-item>
          <el-dropdown-item command="clear">清除缓存</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Layout-logout'
}
</script>

<script setup lang="ts">
import { getCurrentInstance, computed, reactive, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ArrowDown } from '@element-plus/icons'
let { proxy }: any = getCurrentInstance()
const store = useStore()

let command = (val) => {
  if (val === 'help') {
    proxy.$router.push('/help')
  } else if (val === 'exchange') {
    proxy.nextPerson = true
  } else {
    window.location.reload(true)
  }
}

let logout = () => {
  store.dispatch('user/logout').then(() => {
    proxy.$router.push('/')
    location.reload() // 为了重新实例化vue-router对象 避免bug
  })
}
</script>

<style lang="less" scoped>
.layoutLogout {
  position: relative;
  padding-top: 10px;
  min-width: 90px;
  height: 90px;
  margin-right: 10px;
  color: #fff;

  > p,
  > span {
    padding: 0 4px;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      text-decoration: dashed;
    }
  }

  > .el-dropdown {
    cursor: pointer;
    right: 10px;
    bottom: 0;

    .el-dropdown-link {
      color: #fff;
    }
  }
}
</style>
