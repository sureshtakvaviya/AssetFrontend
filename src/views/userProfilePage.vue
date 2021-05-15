<template>
  <div class="userProfilePage">
    <navbar />
    <userProfile :userDetails="userDetails" />
  </div>
</template>

<script>
// @ is an alias to /src
import navbar from "@/components/shared/navbar.vue";
import userProfile from "@/components/modules/user/userProfile.vue";
import store from "@/store";
export default {
  name: "userProfilePage",
  components: {
    navbar,
    userProfile,
  },
  computed: {
    userDetails: function() {
      let userDetails = this.$store.getters['userStore/getLoggedInUserDetails'];
      return userDetails ? userDetails : {};
    },
  },
  beforeRouteEnter(to, from, next) {
    store
      .dispatch("userStore/fetchUserDetailsApi")
      .then((response) => {
        if (response === "success") {
          next();
        } else {
          this.$router.push("/home");
        }
      })
      .catch((error) => {
        console.log(error);
        this.$router.push("/home");
      });
  },
  // when route changes and this component is already rendered,
  // the logic will be slightly different.
  beforeRouteUpdate(to, from, next) {
    store
      .dispatch("userStore/fetchUserDetailsApi")
      .then((response) => {
        if (response === "success") {
          next();
        } else {
          this.$router.push("/home");
        }
      })
      .catch((error) => {
        console.log(error);
        this.$router.push("/home");
      });
  },
};
</script>

<style scoped>
.userProfilePage {
  height: 100%;
}
</style>
