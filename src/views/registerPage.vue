<template>
  <div class="registerPage">
    <register/>
  </div>
</template>

<script>
// @ is an alias to /src
import register from '@/components/modules/user/register.vue'

export default {
  name: 'registerPage',
  components: {
    register
  }
}
</script>

<style scoped>
.registerPage{
  height: 100%;
}
</style>