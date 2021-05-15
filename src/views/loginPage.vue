<template>
  <div class="loginPage">
    <login />
  </div>
</template>

<script>
// @ is an alias to /src
import login from "@/components/modules/user/login.vue";

export default {
  name: "loginPage",
  components: {
    login,
  },
};
</script>

<style scoped>
.loginPage {
  height: 100%;
}
</style>
