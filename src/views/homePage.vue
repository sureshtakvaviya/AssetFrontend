<template>
  <div class="home">
    <home />
  </div>
</template>

<script>
import home from "@/components/modules/home/home.vue";
export default {
  name: "homePage",
  components: {
    home,
  },
  computed: {
    isUserDetailsAvailable: function() {
      let isUserDetailsAvailable = this.$store.state.userStore.loggedInUser.userprofile;
      return isUserDetailsAvailable ? true : false;
    },
  },
  mounted: function() {
    if (!this.isUserDetailsAvailable) {
      this.$store.dispatch("userStore/fetchUserDetailsApi");
    }
    this.$store.dispatch("homeStore/fetProjectsArrayApi").catch((error) => {
      console.log(error);
      this.$root.$emit("showToast", {
        title: "Retrival Error",
        message: "There has been a problem in fetching your project Data. Please try again or contact support",
        variant: "danger",
      });
    });
  },
};
</script>
