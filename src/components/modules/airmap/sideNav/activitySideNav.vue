<template
  ><div>
    <div class="sidenavListContainer">
      <transition name="slide-fade" mode="out-in">
        <div :key="currentDate">
          <div
            class="d-flex justify-content-between sidenavListItem"
            :class="{
              clickedHighlighter:
                clickedItemKey === currentDate + activityItem.label,
            }"
            @click="activityItemClicked(activityItem)"
            v-for="(activityItem, key, index) in activityArray"
            :key="index"
          >
            <div>
              <span class="ml-2">{{ activityItem.label }}</span>
            </div>
          </div>
        </div>
      </transition>
      <div v-if="$can('create', 'activity')" class="text-center">
        <b-button
          pill
          class="primaryBg mt-2 border-0"
          @click="createNewActivity()"
          v-b-tooltip.hover
          title="Create New Activity"
          ><i class="fa fa-plus"></i
        ></b-button>
      </div>
    </div>
    <transition name="fade">
      <div
        v-if="clickedDetailsVisible"
        class="d-flex flex-column sideBarDetailsContainer"
      >
        <div
          class="d-flex justify-content-between align-items-center bg-dark rounded-top"
        >
          <b class="ml-2 text-light">{{ clickedDetails.label | capitalize }}</b>
          <div role="button" class="mr-2 text-light closeIcon">
            <i
              class="icon fa fa-times"
              aria-hidden="true"
              aria-controls="sidebar"
              @click="closeDetails()"
            ></i>
          </div>
        </div>
        <div class="sideBarDetails d-flex align-items-center rounded-bottom">
          <div class="w-75  px-3 py-2">
            <div class="d-flex justify-content-between">
              <span class="w-50"><b>Description</b></span>
              <span class="w-50 text-right">{{ clickedDetails.description | capitalize }}</span>
            </div>
            <div class="d-flex justify-content-between">
              <span><b>Start Date</b></span>
              <span>{{ clickedDetails.startdate }}</span>
            </div>
            <div class="d-flex justify-content-between">
              <span><b>End Date</b></span>
              <span>{{ clickedDetails.enddate }}</span>
            </div>
          </div>
          <div class="w-25 d-flex justify-content-center">
            <div
              v-if="$can('delete', 'activity')"
              role="button"
              class="text-light p-2"
              v-b-tooltip.hover
              title="Delete Activity"
              @click="showDeleteModal(clickedDetails)"
            >
              <i class="fa fa-trash-o"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <b-modal
      id="createActivityModal"
      centered
      title="Create New Activity"
      :hide-footer="true"
    >
      <createActivityModal />
    </b-modal>
    <b-modal
      id="deleteConfirmModal"
      centered
      title="Deletion Confirmation"
      :hide-footer="true"
    >
      <deleteConfirmModal
        :toBeDeleted="toBeDeleted"
        :id="toBeDeletedId"
        :deleteAPI="deleteActivityApi"
      />
    </b-modal>
  </div>
</template>

<script>
import createActivityModal from "@/components/modules/airmap/sideNav/createActivityModal";
import deleteConfirmModal from "@/components/shared/deleteConfirmModal";

export default {
  name: "activitySideNav",
  components: { createActivityModal, deleteConfirmModal },
  props: {
    activityArray: Array,
  },
  data() {
    return {
      clickedDetailsVisible: false,
      clickedDetails: {},
      clickedItemKey: "",

      toBeDeleted: "",
      toBeDeletedId: "",
      deleteActivityApi: "projectStore/deleteActivity",
    };
  },
  computed: {
    currentDate: function() {
      let currentDate = this.$store.state.airmapStore.currentDate;
      return currentDate ? currentDate : "";
    },
    accessType: function() {
      let accessType = this.$store.state.projectStore.accessType;
      return accessType ? accessType : "read";
    },
  },
  methods: {
    activityItemClicked(activity) {
      this.clickedItemKey = this.currentDate + activity.label;
      this.clickedDetails = activity;
      this.clickedDetailsVisible = true;
      this.$root.$emit("activityItemClicked", activity);
    },
    closeDetails() {
      this.clickedDetails = {};
      this.clickedDetailsVisible = false;
    },
    showDeleteModal(activity) {
      this.toBeDeleted = activity.label;
      this.toBeDeletedId = activity.id;
      this.$bvModal.show("deleteConfirmModal");
    },
    downloadActivity(activity) {
      this.$store.dispatch("airmapStore/downloadActivityApi", activity.id);
    },
    createNewActivity() {
      this.$bvModal.show("createActivityModal");
    },
    removeActivity(activityLabel) {
      if (this.clickedDetails.label === activityLabel) {
        this.clickedDetails = {};
        this.clickedDetailsVisible = false;
        this.clickedItemKey = "";
      }
    },
  },
  mounted: function() {
    this.$root.$on("activityDeleted", (activityLabel) => {
      this.removeActivity(activityLabel);
    });
  },
};
</script>

<style scoped></style>
