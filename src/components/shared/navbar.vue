<template>
  <div>
    <b-navbar class="py-1" toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#" @click.prevent="routeToHome">
        <b class="text-light">ASSET</b>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-button
            v-if="isHomePage"
            pill
            class="primaryBg border-0 mx-3 my-1"
            @click="showCreateModal"
            >+ Create Project</b-button
          >
          <b-nav-item class="mx-2" href="#">About</b-nav-item>
          <b-nav-item class="mx-2" href="#">Contact Us</b-nav-item>
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <i class="fa fa-user-circle text-light"></i>
              <span class="text-light text-capitalize">
                {{ username }}
              </span>
            </template>
            <b-dropdown-item @click="routeToUserProfile"
              >Profile</b-dropdown-item
            >
            <b-dropdown-item
              v-if="$can('manage', 'subusers')"
              @click="routeToManageUsers"
              >Manage Users</b-dropdown-item
            >
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-modal
      size="lg"
      id="createProjectModal"
      title="Create New Project"
      :hide-footer="true"
      centered
    >
      <createProject />
    </b-modal>
  </div>
</template>

<script>
import createProject from "@/components/modules/home/createProject.vue";
export default {
  name: "navbar",
  components: { createProject },
  computed: {
    username: function() {
       let username = this.$store.state.userStore.loggedInUser.username;
      return username ? username : "user"; 
    },
    //Create Project is shown only on homepage
    isHomePage: function() {
      let currentPage = window.location.pathname;
      return currentPage.includes("home") ? true : false;
    },
  },
  methods: {
    showCreateModal() {
      this.$bvModal.show("createProjectModal");
    },
    logout() {
      this.$store.dispatch("userStore/logout");
      this.$router.push("/login");
    },
    routeToHome() {
      this.$router.push("/home");
    },
    routeToUserProfile() {
      this.$router.push("/user-profile");
    },
    routeToManageUsers() {
      this.$router.push("/manage-users");
    },
  },
};
</script>

<style scoped>
.logo {
  width: 85px;
  height: 60px;
}
.navbar {
  min-height: 60px;
}
.navbar-dark .navbar-nav .nav-link {
  color: var(--light) !important;
}
.navbar-dark .navbar-nav .nav-link i {
  font-size: 1.5em;
}
.nav-item {
  border-bottom: 4px solid transparent;
}
.nav-item:hover {
  border-bottom: 4px solid var(--primaryBg);
}
@media (min-width: 992px) {
  .navbar-nav {
    align-items: center;
  }
}
</style>
