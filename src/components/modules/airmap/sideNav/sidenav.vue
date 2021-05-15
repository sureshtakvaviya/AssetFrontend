<template>
  <div class="sidenav d-flex flex-column align-items-center">
    <div id="sidenavLogo my-2" role="button" @click="routeToHome">
      <h1 class="text-light">A</h1>
    </div>
    <div id="dynamicLinks" class="h-75">
      <div
        v-for="link in freemiumLinks"
        :key="link.header"
        href="#"
        @click.prevent="switchSideNav(link.header)"
        class="sidenavLinks d-flex justify-content-center align-items-center my-3 py-3"
        :class="{ clickedSideNav: sideBarHeader === link.header }"
        v-b-tooltip.hover.right
        :title="link.header"
        :disabled="link.isDisabled"
      >
        <i :class="link.icon" aria-hidden="true"></i>
      </div>

      <div v-if="$can('use', 'Enterprise') || $can('use', 'Premium')">
        <div
          v-for="link in premiumLinks"
          :key="link.header"
          href="#"
          @click.prevent="switchSideNav(link.header)"
          class="sidenavLinks d-flex justify-content-center align-items-center my-3 py-3"
          :class="{ clickedSideNav: sideBarHeader === link.header }"
          v-b-tooltip.hover.right
          :title="link.header"
          :disabled="link.isDisabled"
        >
          <i :class="link.icon" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <div id="staticLinks" class="h-25 mb-5">
      <div
        class="sidenavLinks d-flex justify-content-center align-items-center my-3 py-3"
        v-b-tooltip.hover.right
        title="Project Info"
        @click="isProjectInfoShown = !isProjectInfoShown"
      >
        <i class="fas fa-info-circle" aria-hidden="true"></i>
      </div>
      <div
        class="sidenavLinks d-flex justify-content-center align-items-center my-3 py-3"
        v-b-tooltip.hover.right
        title="Project Info"
      >
        <i class="fas fa-cog"></i>
      </div>
      <div
        class="sidenavLinks d-flex justify-content-center align-items-center my-3 ml-1 py-3"
      >
        <b-dropdown dropright variant="dark" class="mx-2">
          <template #button-content>
            <i class="fa fa-user-circle"></i>
          </template>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
    <b-sidebar id="sidebar" :no-header="true" :visible="sideBarVisible" shadow>
      <div class="sideBarContainer">
        <div class="sideBarMenuContainer">
          <div class="headingContainer">
            <b class="title">{{ sideBarHeader }}</b>
            <span class="icon-container">
              <i
                class="icon fa fa-times"
                aria-hidden="true"
                aria-controls="sidebar"
                @click="closeSideBar('assetMenu')"
              ></i>
            </span>
          </div>
          <div>
            <summarySideNav
              v-if="sideBarHeader === 'Summary'"
              :summaryData="summaryApiData"
            />
            <assetsSideNav
              v-if="sideBarHeader === 'Assets'"
              :assetData="summaryAssetData"
            />
            <deviation
              v-if="sideBarHeader === 'Deviation'"
              :deviationdata="deviationApiData"
            />
            <inverterSideNav
              v-if="sideBarHeader === 'Inverter'"
              :inverterApiData="inverterApiData"
            />
            <inverterdeviation
            v-if="sideBarHeader === 'InverterDeviation'"
            :inverterdeviationApiData="inverterdeviationApiData"
            />

            <aoiSideNav v-if="sideBarHeader === 'AOI'" :aoiArray="AOIData" />
            <measureSideNav
              v-if="sideBarHeader === 'Measure'"
              :measuresArray="measureData"
            />
            <cadAlignSideNav
              v-if="sideBarHeader === 'CAD'"
              :cadArray="cadAlignData"
            />
            <activitySideNav
              v-if="sideBarHeader === 'Activities'"
              :activityArray="activityData"
            />
          </div>
        </div>
      </div>
    </b-sidebar>
    <div class="projectInfoContainer">
      <b-alert v-model="isProjectInfoShown" variant="dark" dismissible fade>
        <h4 class="alert-heading">{{ projectInfo.projectName }}</h4>
        <p>
          {{ projectInfo.projectType }}
        </p>
        <hr />
      </b-alert>
    </div>
    
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import summarySideNav from "./summarySideNav";
import deviation from "./deviation";
import inverterdeviation from  "./inverterdeviation";
import assetsSideNav from "./assetsSideNav";
import inverterSideNav from "./inverterSideNav";
import activitySideNav from "./activitySideNav";
import aoiSideNav from "./aoiSideNav";
import measureSideNav from "./measureSideNav";
import cadAlignSideNav from "./cadAlignSideNav";

export default {
  name: "sidenav",
  components: {
    summarySideNav,
    assetsSideNav,
    inverterSideNav,
    aoiSideNav,
    measureSideNav,
    cadAlignSideNav,
    activitySideNav,
    deviation,
    inverterdeviation,
  },
  data() {
    return {
      sidebarId: "",
      sideBarHeader: "",
      sideBarVisible: false,
      clickedSideNav: "",
      sideBarContent: {},
      isProjectInfoShown: false,
    };
  },
  computed: {
    ...mapGetters({
      summaryApiData: "projectStore/getSummaryData",
      summaryAssetData: "projectStore/getSummaryAssetData",
      inverterApiData: "projectStore/getInverterData",
      inverterdeviationApiData: "projectStore/getInverterDivData",
      deviationApiData: "projectStore/getDeviationData",
      activityData: "projectStore/getActivityData",
      AOIData: "airmapStore/getAllAOIs",
      measureData: "airmapStore/getAllMeasures",
      cadAlignData: "airmapStore/getAllCadAlign",
      projectInfo: "projectStore/getProjectInfo",
    }),
    freemiumLinks: function () {
      let sideBarLinks = [];
      let projectType = this.$store.state.projectStore.projectType;
      if (
        this.$store.state.projectStore.currentDateProject.type ===
          "SCQM+SCPM" ||
        this.$store.state.projectStore.currentDateProject.type === "SCQM"
      ) {
        if (projectType === "Construction_Site") {
          sideBarLinks = [
            { header: "Assets", icon: "fas fa-chart-pie" },
            { header: "Compare", icon: "fa fa-arrows-h" },
          ];
        } else {
          sideBarLinks = [
            // { header: "Summary", icon: "fas fa-chart-pie" },
            // { header: "Inverter", icon: "fas fa-adjust" },
            { header: "InverterDeviation", icon: "fa fa-random"},
            { header: "Deviation", icon: "fa fa-map-signs" },
            { header: "Compare", icon: "fa fa-arrows-h" },
          ];
        }
      }

       else {
        if (projectType === "Construction_Site") {
          sideBarLinks = [
            { header: "Assets", icon: "fas fa-chart-pie" },
            { header: "Compare", icon: "fa fa-arrows-h" },
          ];
        } else {
          sideBarLinks = [
            { header: "Summary", icon: "fas fa-chart-pie" },
            { header: "Inverter", icon: "fas fa-adjust" },
            { header: "Compare", icon: "fa fa-arrows-h" },
          ];
        }
      }

      return sideBarLinks;
    },
    premiumLinks: function () {
      let sideBarLinks = [];
      sideBarLinks.push(
        { header: "3D model", icon: "fa fa-cube" },
        { header: "AOI", icon: "fa fa-object-group" },
        { header: "Measure", icon: "fa fa-ruler-combined" },
        { header: "CAD", icon: "fa fa-cloud-upload" }
      );
      if (this.$store.state.userStore.isEnterpriseAdmin) {
        sideBarLinks.push({ header: "Activities", icon: "fas fa-tasks" });
      }
      return sideBarLinks;
    },
  },
  methods: {
    switchSideNav(header) {
      if (this.sideBarHeader.trim() === header.trim()) {
        this.closeSideBar();
      } else {
        switch (header) {
          case "Summary":
          case "Assets":
          case "Deviation":
          case "InverterDeviation":
          case "Inverter":
          case "Activities":
            this.sideBarVisible = true;
            break;
          case "Compare":
            {

              this.sideBarVisible = false;
              let projectId = this.$route.params.projectId;
              this.$router.push(`/projects/compare/${projectId}`);
            }
            break;
          //Not using waterfall
          case "AOI":
            {
              this.sideBarVisible = true;
            }
            break;
          case "Measure":
            {
              this.sideBarVisible = true;
            }
            break;
          case "CAD":
            {
              this.sideBarVisible = true;
            }
            break;
          default:
            break;
        }
        this.sideBarHeader = header;
      }
    },
    closeSideBar() {
      this.sideBarVisible = false;
      this.sideBarHeader = "";
    },
    routeToHome() {
      this.$router.push("/home");
    },
    logout() {
      this.$store.dispatch("userStore/logout");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.sidenav {
  min-width: 3.5rem;
  height: 100%;
  position: fixed;
  left: 0;
  z-index: 999;
  background-color: var(--dark);
  box-shadow: 2px 2px var(--shadow);
  color: white;
}
div.sidenavLinks {
  color: var(--light);
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  cursor: pointer;
}
div.sidenavLinks:hover {
  color: var(--primaryHover);
}
.sideBarContainer {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.sideBarMenuContainer {
  flex: 2;
  overflow-y: auto;
}
.headingContainer {
  display: flex;
  justify-content: space-between;
  height: 45px;
  padding: 12px 14px;
  color: var(--light);
  background-color: var(--primaryBg);
  box-shadow: 1px 1px var(--shadow);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.headingContainer .icon-container {
  transition: 0.3s;
}
.clickedSideNav {
  color: var(--primaryBg) !important;
  background-color: var(--light);
}
.projectInfoContainer {
  position: absolute;
  width: 15vw;
  min-width: 20px;
  bottom: 10%;
  left: 100%;
}
</style>
