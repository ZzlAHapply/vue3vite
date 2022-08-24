<template>
  <div class="Login">
    <div class="top">
      <div class="logo">
        <!-- <div class="img">
          <img src="../../assets/login/dh.png" />
          <img src="../../assets/login/gh.png" />
        </div> -->
        <h1 class="dept">XX查询审批系统</h1>
      </div>
    </div>

    <div class="content">
      <!-- <img src="../../assets/login/login_left_img.png" /> -->
      <div class="login_form">
        <div class="title">
          <h3>
            <b>平台登录</b>
            <span>LOGIN</span>
          </h3>
        </div>
        <el-form :model="formInline" status-icon :rules="formRulesMixin" ref="loginFormRef" label-width="0px">
          <el-form-item prop="username" :rules="formRulesMixin.isNotNull">
            <el-input v-model="formInline.username" autocomplete="off">
              <template #prepend>
                <svg-icon icon-class="user" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password" :rules="formRulesMixin.minLength5">
            <el-input type="password" v-model="formInline.password" autocomplete="off">
              <template #prepend>
                <svg-icon icon-class="password" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" type="primary" round class="login-btn" @click.prevent="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/*可以设置默认的名字*/
export default {
  name: 'Login'
}
</script>

<script setup lang="ts">
import { reactive, getCurrentInstance, watch, ref } from 'vue'
import settings from '@/settings'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { ObjTy } from '@/types/common'
let { proxy }: any = getCurrentInstance()
//form
let formInline = reactive({
  username: 'tangyuying',
  password: '123456'
})
let state: ObjTy = reactive({
  otherQuery: {},
  redirect: undefined
})

/* listen router change  */
const route = useRoute()
let getOtherQuery = (query: ObjTy) => {
  return Object.keys(query).reduce((acc: ObjTy, cur) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur]
    }
    return acc
  }, {})
}

watch(
  route,
  (route) => {
    const query = route.query
    if (query) {
      state.redirect = query.redirect
      state.otherQuery = getOtherQuery(query)
    }
  },
  { immediate: true }
)
/*
 *  login relative
 * */
let loading = ref(false)
let tipMessage = ref('')
const store = useStore()
let handleLogin = () => {
  proxy.$refs['loginFormRef'].validate((valid: boolean) => {
    if (valid) {
      loginReq()
    } else {
      return false
    }
  })
}
let loginReq = () => {
  loading.value = true
  store
    .dispatch('user/login', formInline)
    .then(() => {
      ElMessage({ message: '登录成功', type: 'success' })
      proxy.$router.push({ path: '/', query: state.otherQuery })
    })
    .catch((res) => {
      tipMessage.value = res.msg
      proxy.sleepMixin(30).then(() => {
        loading.value = false
      })
    })
}

/*
 *  password show or hidden
 * */
let passwordType = ref('password')
const refPassword: any = ref(null)
let showPwd = () => {
  if (passwordType.value === 'password') {
    passwordType.value = ''
  } else {
    passwordType.value = 'password'
  }
  proxy.$nextTick(() => {
    refPassword.value.focus()
  })
}
</script>

<style lang="less" scoped>
.Login {
  background-color: #fff;

  .top {
    width: 1200px;
    overflow: hidden;
    height: 120px;
    margin: 0 auto;

    .logo {
      float: left;
      display: flex;
      height: 100%;
      color: rgb(21, 72, 177);

      .dept {
        display: flex;
        flex-flow: column;
        height: 100%;
        overflow: hidden;
        margin: 0 10px;
        padding: 40px 0;
        width: 260px;

        h3 {
          font-size: 20px;
          text-align: justify;
          text-align-last: justify;
        }
      }

      .name {
        font-size: 40px;
        line-height: 114px;
      }

      .img {
        line-height: 150px;

        img {
          width: 44px;
          height: 44px;
        }
      }
    }

    span {
      float: left;
      font-size: 20px;
      line-height: 160px;
      color: #999;
    }
  }

  .content {
    width: 100%;
    height: 645px;
    background: #3573ff url('../../assets/login/login_bg.png') no-repeat center;

    > img {
      margin-left: 17vw;
      margin-top: 85px;
    }

    > .login_form {
      float: right;
      margin-top: 100px;
      margin-right: 17vw;
      width: 410px;
      height: 400px;
      padding: 0 30px;
      background-color: #fff;
      border-radius: 12px;

      .title {
        height: 100px;
        line-height: 100px;
        font-size: 22px;
        color: #666;

        > h3 {
          height: 100px;
          line-height: 100px;
        }

        span {
          font-size: 20px;
          color: #999;
          font-weight: normal;
          padding: 0 8px;
        }
      }

      .el-form {
        .el-input {
          font-size: 24px;
          line-height: 40px;
        }

        :deep(.el-input__inner) {
          height: 42px;
          line-height: 42px;
        }

        .login-btn {
          width: 100%;
        }
      }
    }
  }
}
</style>
