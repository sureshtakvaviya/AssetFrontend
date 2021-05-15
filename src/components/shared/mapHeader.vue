<template>
  <div class="topNavContainer">
    <div class="topNav">
      <div class="logoAndTitle">
        <div class="logo ml-1">
          <div role="button" @click="routeToHome">
            <img
              class="bg-dark rounded"
              :src="require(`@/assets/img/tapl_bird_white.png`)"
              style="width: 85px;margin-top: -3%;margin-left:1.5%; height:60px;"
            />
          </div>
          <div class="projectDetailsToggler ml-1">
            <i class="fa fa-caret-right text-dark "></i>
          </div>
        </div>
        <div class="projectDetailsContainer bg-dark text-light rounded ml-3">
          <b>{{ title }}</b>
          <div v-if="type === 'Construction_Site'" class="ml-2">
            <i class="fas fa-city" v-b-tooltip.hover.right :title="type"></i>
          </div>
          <div v-else class="ml-2">
            <i
              class="fas fa-solar-panel"
              v-b-tooltip.hover.right
              :title="type"
            ></i>
          </div>
        </div>
      </div>
      <div class="userSection mr-1 shadow">
        <b-dropdown dropright variant="dark" class="mx-2">
          <template #button-content>
            <i class="fa fa-user-circle text-light"></i>
            <span class="text-light text-capitalize">
              {{ username }}
            </span>
          </template>
          <b-dropdown-item @click="routeToUserProfile">Profile</b-dropdown-item>
          <b-dropdown-item
            v-if="$can('manage', 'subusers')"
            @click="routeToManageUsers"
            >Manage Users</b-dropdown-item
          >
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "mapHeader",
  computed: {
    title: function() {
      return this.$store.state.projectStore.projectName;
    },
    type: function() {
      return this.$store.state.projectStore.projectType;
    },
    username: function() {
      let username = localStorage.getItem("username");
      return username ? username : "user";
    },
  },
  data() {
    return {};
  },
  methods: {
    routeToHome() {
      this.$router.push("/home");
    },
    routeToUserProfile() {
      this.$router.push("/user-profile");
    },
    routeToManageUsers() {
      this.$router.push("/manage-users");
    },
    logout() {
      this.$store.dispatch("userStore/logout")
      this.$router.push("/login")
    },
  },
};
</script>

<style scoped>
.topNavContainer {
  position: absolute;
  top: 5px;
  width: 100%;
  z-index: 999;
}
.topNav {
  display: flex;
  justify-content: space-between;
}
.logoAndTitle {
  display: flex;
  flex-basis: 50%;
}
.logo {
  display: flex;
}
.projectDetailsToggler {
  align-self: center;
}
.projectDetailsContainer {
  display: flex;
  align-self: center;
  padding: 5px 10px;
  flex-basis: content;
}
</style>
