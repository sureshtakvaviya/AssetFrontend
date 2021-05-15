<template>
  <div>
    <div v-if="false" id="navbar">
      <mapHeader />
    </div>
    <div>
      <timeline />
      <sidenav />
      <airmap />
      <chatRoom v-if="$can('use', 'Enterprise')" />
    </div>
  </div>
</template>

<script>
import store from "@/store";
import router from "@/router";
import mapHeader from "@/components/shared/mapHeader.vue";
import timeline from "@/components/modules/airmap/timeline.vue";
import airmap from "@/components/modules/airmap/airmap.vue";
import sidenav from "@/components/modules/airmap/sideNav/sidenav.vue";
import chatRoom from "@/components/modules/chat/chatRoom.vue";
export default {
  name: "mapPage",
  data() {
    return {};
  },
  components: {
    mapHeader,
    airmap,
    sidenav,
    timeline,
    chatRoom,
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.projectId) {
      let isUserDetailsAvailable =
        store.state.userStore.loggedInUser.userprofile;
      if (!isUserDetailsAvailable) {
        store.dispatch("userStore/fetchUserDetailsApi");
      }
      store
        .dispatch("projectStore/fetchProjectByIdApi", {
          projectId: +to.params.projectId,
          page: "map",
        })
        .then((response) => {
          if (response === "success") {
            next();
          }
        })
        .catch((error) => {
          next(false);
          console.log(JSON.stringify(error));
        });
    } else {
      router.push("/home");
    }
  },
};
</script>

<style scoped>
@import "../assets/css/sidenavStyles.css";
</style>
