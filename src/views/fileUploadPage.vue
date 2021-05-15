<template>
  <div class="fileUploadPage">
    <navbar />
    <fileUpload />
  </div>
</template>

<script>
// @ is an alias to /src
import navbar from "@/components/shared/navbar.vue";
import fileUpload from "@/components/modules/home/fileUpload.vue";
import store from "@/store";
import router from "@/router";

export default {
  name: "fileUploadPage",
  components: {
    navbar,
    fileUpload,
  },
  beforeRouteEnter(to, from, next) {
    store
      .dispatch("userStore/fetchUserDetailsApi")
      .then((response) => {
        if (response === "success") {
          let userType = store.getters["userStore/getLoggedInUserType"];
          if (userType === "Admin") {
            next();
          } else {
            router.push("/home");
          }
        } else {
          router.push("/home");
        }
      })
      .catch((error) => {
        console.log(error);
        router.push("/home");
      });
  },
  // when route changes and this component is already rendered,
  // the logic will be slightly different.
  beforeRouteUpdate(to, from, next) {
    store
      .dispatch("userStore/fetchUserDetailsApi")
      .then((response) => {
        if (response === "success") {
          let userType = store.getters["userStore/getLoggedInUserType"];
          if (userType === "Admin") {
            next();
          } else {
            router.push("/home");
          }
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
.fileUploadPage {
  height: 100%;
}
</style>
