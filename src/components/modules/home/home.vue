<template>
  <div class="home">
    <navbar />
    <div class="d-flex justify-content-between m-2">
      <div class="d-flex">
        <div
          v-for="filterOption in filterOptions"
          :key="filterOption.text"
          class="m-2"
          @click="changeFilter(filterOption.value)"
        >
          <span
            class="filterOption"
            :class="{
              selectedFilter: filter === filterOption.value,
            }"
            >{{ filterOption.text }}
          </span>
        </div>
      </div>
      <div class="d-flex align-items-center">
        <span>
          <i class="fa fa-sort-amount-down"></i>
        </span>
        <b-form-group class="m-2">
          <b-form-select
            v-model="sort"
            variant="dark"
            :options="sortOptions"
          ></b-form-select>
        </b-form-group>
      </div>
    </div>
    <div v-if="projectsArray.length > 0" class="w-90 d-flex flex-wrap mx-auto">
      <div v-for="(project, index) in sortedArray" :key="index">
        <b-card
          tag="article"
          style="max-width: 25rem;"
          class="mb-4 mx-3 shadow-sm"
          :img-src="imageProp(project)
          "
          img-alt="Image"
          img-top
        >
          <div
            v-if="project.access !== 'read'"
            class="projectButtonsContainer d-flex justify-content-end"
          >
            <b-button
              pill
              class="mx-1 transparentBg"
              v-b-tooltip.hover
              title="Edit Project"
              @click="showEditProject(project)"
            >
              <i class="fa fa-pencil"></i>
            </b-button>
            <b-button
              v-if="$can('use', 'Enterprise')"
              pill
              class="mx-1 transparentBg"
              v-b-tooltip.hover
              title="Share Project"
              @click="showShareModal(project)"
            >
              <i class="fa fa-share-alt"></i>
            </b-button>
            <b-button
              pill
              v-b-tooltip.hover
              title="Delete Project"
              class="mx-1 transparentBg"
              @click="showDeleteModal(project)"
            >
              <i class="fa fa-trash-o"></i>
            </b-button>
          </div>
          <div class="d-flex justify-content-between">
            <h5 class="card-title">{{ project.title }}</h5>
            <div>
              <span><i class="mr-1 fas fa-map-marker-alt"></i></span>
              <span>{{ project.city | capitalize }}</span>
            </div>
          </div>
          <b-card-text class="text-capitalize">
            {{ project.description }}
          </b-card-text>
          <b-link class="text-primaryBg" href="#" @click="routeToMap(project)"
            ><b>View</b></b-link
          >
          <b-link
            class="text-primaryBg ml-4"
            href="#"
            @click="showStatusModal(project)"
            ><b>Status</b></b-link
          >
          <b-link
            class="text-primaryBg float-right"
            href="#"
            v-b-tooltip.hover
            title="Upload Project Files"
            @click="routeToFileUpload(project)"
            ><b><i class="fas fa-upload"></i></b
          ></b-link>
        </b-card>
      </div>
    </div>
    <div v-else>
      <div v-if="hasProjectFetched" class="text-center display-4">
        You have no projects
      </div>
    </div>
    <b-modal
      size="lg"
      id="editProjectModal"
      title="Edit Project"
      :hide-footer="true"
      centered
    >
      <editProject :projectData="projectToBeEdited" />
    </b-modal>
    <b-modal
      id="shareModal"
      scrollable
      title="Share your project"
      :hide-footer="true"
      centered
    >
      <shareModal :projectId="projectToBeShared_Id" />
    </b-modal>
    <b-modal
      id="statusModal"
      :title="statusModalTitle"
      size="lg"
      :hide-footer="true"
      centered
    >
      <statusModal :statusArray="projectStatus" />
    </b-modal>
    <b-modal
      id="deleteConfirmModal"
      title="Deletion Confirmation"
      :hide-footer="true"
      centered
    >
      <deleteConfirmModal
        :toBeDeleted="toBeDeleted"
        :id="toBeDeletedId"
        :deleteAPI="deleteAOIApi"
      />
    </b-modal>
  </div>
</template>

<script>
import navbar from "@/components/shared/navbar.vue";
import editProject from "./editProject";
import shareModal from "./shareModal";
import statusModal from "./statusModal";
import deleteConfirmModal from "@/components/shared/deleteConfirmModal";
export default {
  name: "home",
  components: {
    navbar,
    editProject,
    shareModal,
    statusModal,
    deleteConfirmModal,
  },
  data() {
    return {
      filterOptions: [
        { text: "All Projects", value: "all" },
        { text: "Solar", value: "solar" },
        { text: "Construction", value: "construction" },
      ],
      sortOptions: [
        { text: "Date - New to Old", value: "created_date_desc" }, //TODO sort options adding after backend is done
        { text: "Date - Old to New", value: "created_date_asc" },
      ],
      filter: "all",
      sort: "created_date_desc",
      projectToBeEdited: {},
      projectToBeShared_Id: {},
      projectStatus: [],
      statusModalTitle: "",

      toBeDeleted: "",
      toBeDeletedId: "",
      deleteAOIApi: "homeStore/deleteProjectApi",
    };
  },
  computed: {
    hasProjectFetched: function() {
      let hasProjectFetched = this.$store.state.homeStore.projectDataFetched;
      return hasProjectFetched;
    },
    projectsArray: function() {
      return this.$store.state.homeStore.projectsArray;
    },
    solarArray: function() {
      let solarArray = this.projectsArray.filter(
        (project) => project.sector === "Solar_Site"
      );
      return solarArray ? solarArray : [];
    },
    constructionArray: function() {
      let constructionArray = this.projectsArray.filter(
        (project) => project.sector === "Construction_Site"
      );
      return constructionArray ? constructionArray : [];
    },
    filteredArray: function() {
      switch (this.filter) {
        case "solar":
          return this.solarArray;
        case "construction":
          return this.constructionArray;

        default:
          return this.projectsArray;
      }
    },
    sortedArray: function() {
      let sortedArray = [];
      let projectArray = this.filteredArray;
      //Going for switch to allow for other sorting options in future
      switch (this.sort) {
        case "created_date_asc":
          {
            sortedArray = projectArray.sort((project1, project2) => {
              return (
                new Date(project1.created_date) -
                new Date(project2.created_date)
              );
            });
          }
          break;
        case "created_date_desc":
          {
            sortedArray = projectArray.sort((project1, project2) => {
              return (
                new Date(project2.created_date) -
                new Date(project1.created_date)
              );
            });
          }
          break;
      }
      return sortedArray;
    },
  },
  methods: {
    changeFilter(filterOption) {
      this.filter = filterOption ? filterOption : "all";
    },
    routeToMap(projectData) {
      if (projectData) this.$router.push(`/projects/map/${projectData.id}`);
    },
    routeToFileUpload(projectData) {
      if (projectData) this.$router.push(`/file-upload/${projectData.id}`);
    },
    imageProp(projectData) {
      let imageProp;
      if (projectData.projectprofileimage) {
        imageProp =
          projectData.projectprofileimage
        return imageProp;
      }
      //If project doesn't have user defined picture
      let sector = projectData.sector;
      if (sector) {
        if (sector === "Construction_Site") {
          imageProp = `${require("@/assets/img/construction-default-pic2.jpg")}`
        } else {
          imageProp = `${require("@/assets/img/solar-default-pic.jpg")}`
        }
      }
      return imageProp;
    },
    showEditProject(project) {
      let editable = { ...project }; // js passes objects and arrays as a reference. so passing a copy
      this.projectToBeEdited = editable;
      this.$bvModal.show("editProjectModal");
    },
    showShareModal(project) {
      this.projectToBeShared_Id = project.id;
      this.$bvModal.show("shareModal");
    },
    showStatusModal(project) {
      this.projectStatus = project.status;
      this.statusModalTitle = `Current Status of ${project.title}`;
      this.$bvModal.show("statusModal");
    },
    showDeleteModal(project) {
      this.toBeDeleted = project.title;
      this.toBeDeletedId = project.id;
      this.$bvModal.show("deleteConfirmModal");
    },
    deleteProject(project) {
      this.$store
        .dispatch("homeStore/deleteProjectApi", project.id)
        .then((response) => {
          if (response === "success") {
            this.handleToast({
              message: "Project Deleted Successfully",
              variant: "success",
              title: "Deletion Successful",
            });
          } else {
            this.handleToast({
              message:
                "There has been some error in deleting your project. Try again later or contact support",
              variant: "danger",
              title: "Error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.handleToast({
            message:
              "There has been some error in deleting your project. Try again later or contact support",
            variant: "danger",
            title: "Error",
          });
        });
    },
    handleToast(toastData) {
      this.$root.$emit("showToast", toastData);
    },
  },
  mounted() {
    this.$root.$on("projectDeleted", (deletedProject) => {
      this.$root.$emit("showToast", {
        message: `${deletedProject} deleted successfully`,
        title: "Deleted",
        variant: "success",
      });
    });
  },
};
</script>

<style scoped>
.home {
  height: 100%;
}
.projectButtonsContainer {
  position: absolute;
  top: 5%;
  right: 5%;
}
.card-img-top {
  height: 250px;
}
.filterOption {
  display: block;
  cursor: pointer;
}
.filterOption:hover {
  border-bottom: 4px solid var(--primaryBg);
}
.selectedFilter {
  border-bottom: 4px solid var(--primaryBg);
  font-weight: bold;
  display: block;
}
.btn-outline-primary {
  color: var(--primaryBg);
  border-color: var(--primaryBg);
}
.btn-outline-primary:hover {
  background-color: var(--primaryBg);
  color: var(--light);
  border-color: var(--light);
}
.w-90 {
  width: 90%;
}
@media (max-width: 992px) {
  .w-90 {
    justify-content: center;
  }
}
</style>
