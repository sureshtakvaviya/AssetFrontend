<template>
  <div class="manageUsersPage">
    <navbar />
    <manageUsers :subUsers="subUsers" />
  </div>
</template>

<script>
// @ is an alias to /src
import navbar from "@/components/shared/navbar.vue";
import manageUsers from "@/components/modules/user/manageUsers.vue";
import store from "@/store";
import router from "@/router";
export default {
  name: "manageUsersPage",
  components: {
    navbar,
    manageUsers,
  },
  computed: {
    subUsers: function() {
      let subUsers = this.$store.getters["userStore/getAllSubUsers"];
      return subUsers ? subUsers : {};
    },
  },
  beforeRouteEnter(to, from, next) {
    let isUserDetailsAvailable = store.state.userStore.loggedInUser.userprofile;
    if (!isUserDetailsAvailable) {
      store.dispatch("userStore/fetchUserDetailsApi");
    }
    store
      .dispatch("userStore/getAllSubUsersApi")
      .then((response) => {
        if (response === "success") {
          next();
        } else {
          router.push("/home");
        }
      })
      .catch((error) => {
        console.log(error);
        router.push("/home");
      });
  },
};
</script>

<style scoped>
.manageUsersPage {
  height: 100%;
}
</style>
