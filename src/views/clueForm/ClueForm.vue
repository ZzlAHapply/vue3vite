<template>
  <div class="clue_form">
    <FormTemp></FormTemp>
  </div>
</template>
<script lang="ts">
export default {
  name: 'clue_form'
}
</script>

<script setup lang="ts">
import { getCurrentInstance, computed, reactive, ref, toRefs, onMounted } from 'vue'
import { useStore } from 'vuex'
import { updateWaitConsult } from '@/api/petition'
import FormTemp from '@/components/formTemp'

// import { PetitionTable, ClueTable, BatchTable, ClueMenus } from './components'

const store = useStore()
let { proxy }: any = getCurrentInstance()
let ListRef = ref(null)

let state = reactive({})

// let isAppeal = computed(() => {
//   return (
//     store.getters.roles.includes('ap_reciver') ||
//     store.getters.roles.includes('ap_worker') ||
//     store.getters.roles.includes('ap_leader')
//   )
// })

let {} = toRefs(state)
</script>
<style scoped lang="less">
.clue_form {
}
</style>
