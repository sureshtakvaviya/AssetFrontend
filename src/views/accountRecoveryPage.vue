<template>
  <div class="accountRecoveryPage">
    <accountRecovery/>
  </div>
</template>

<script>
// @ is an alias to /src
import accountRecovery from '@/components/modules/user/accountRecovery.vue'

export default {
  name: 'accountRecoveryPage',
  components: {
    accountRecovery
  }
}
</script>

<style scoped>
.accountRecoveryPage{
  height: 100%;
}
</style>