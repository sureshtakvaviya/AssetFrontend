<template>
  <div>
    <div class="sidenavListContainer">
      <transition name="slide-fade" mode="out-in">
        <div :key="currentDate">
          <div
            class="d-flex justify-content-between sidenavListItem"
            :class="{
              clickedHighlighter:
                clickedItemKey === currentDate + aoiItem.label,
            }"
            @click="aoiItemClicked(aoiItem)"
            v-for="(aoiItem, key, index) in aoiArray"
            :key="index"
          >
            <div>
              <span class="ml-2">{{ aoiItem.label }}</span>
            </div>
          </div>
        </div>
      </transition>
      <div v-if="$can('create', 'aoi')" class="text-center">
        <b-button
          pill
          class="primaryBg mt-2 border-0"
          @click="createNewAoi()"
          v-b-tooltip.hover
          title="Create New AOI"
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
              <span><b>Created By</b></span>
              <span>{{ clickedDetails.created_by | capitalize }}</span>
            </div>
            <div class="d-flex justify-content-between">
              <span><b>Created On</b></span>
              <span>{{
                clickedDetails.creation_date | dateFormat("MMM D, YYYY h:mm A")
              }}</span>
            </div>
          </div>
          <div class="w-25 d-flex justify-content-center">
            <div
              role="button"
              class="text-light p-2"
              @click="downloadAoi(clickedDetails)"
              v-b-tooltip.hover
              title="Download AOI"
            >
              <i class="fa fa-download"></i>
            </div>
            <div
              role="button"
              class="text-light p-2"
              v-if="$can('delete', 'aoi')"
              v-b-tooltip.hover
              title="Delete AOI"
              @click="showDeleteModal(clickedDetails)"
            >
              <i class="fa fa-trash-o"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <b-modal
      id="deleteConfirmModal"
      centered
      title="Deletion Confirmation"
      :hide-footer="true"
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
import deleteConfirmModal from "@/components/shared/deleteConfirmModal";
export default {
  name: "aoiSideNav",
  components: { deleteConfirmModal },
  props: {
    aoiArray: Array,
  },
  data() {
    return {
      clickedDetailsVisible: false,
      clickedDetails: {},
      clickedItemKey: "",

      toBeDeleted: "",
      toBeDeletedId: "",
      deleteAOIApi: "airmapStore/deleteAOIApi",
      callOnce: 1, // Due to the issue of v-b-tooltip calling destroy hooks many times
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
    aoiItemClicked(aoi) {
      this.clickedItemKey = this.currentDate + aoi.label;
      this.clickedDetails = aoi;
      this.clickedDetailsVisible = true;
      this.$root.$emit("aoiItemClicked", aoi);
    },
    closeDetails() {
      this.clickedDetails = {};
      this.clickedDetailsVisible = false;
    },
    showDeleteModal(aoi) {
      this.toBeDeleted = aoi.label;
      this.toBeDeletedId = aoi.id;
      this.$bvModal.show("deleteConfirmModal");
    },
    downloadAoi(aoi) {
      this.$store.dispatch("airmapStore/downloadAoiApi", aoi.id);
    },
    createNewAoi() {
      this.$root.$emit("createNewAoi");
    },
    removeAoi(aoiLabel) {
      if (this.clickedDetails.label === aoiLabel) {
        this.clickedDetails = {};
        this.clickedDetailsVisible = false;
      }
    },
  },
  mounted: function() {
    this.$root.$on("aoiDeleted", (aoiLabel) => {
      this.removeAoi(aoiLabel);
    });
  },
  destroyed: function() {
    if (this.callOnce) {
      this.callOnce = null;
      this.$root.$emit("aoiClosed");
    }
  },
};
</script>

<style scoped></style>
