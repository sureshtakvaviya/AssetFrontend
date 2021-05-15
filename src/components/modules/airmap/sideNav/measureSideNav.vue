<template>
  <div>
    <div class="sidenavListContainer">
      <transition name="slide-fade" mode="out-in">
        <div :key="currentDate">
          <div
            class="d-flex justify-content-between sidenavListItem"
            :class="{
              clickedHighlighter:
                clickedItemKey === currentDate + measureItem.label,
            }"
            @click="measureItemClicked(measureItem)"
            v-for="(measureItem, key, index) in measuresArray"
            :key="index"
          >
            <div>
              <span class="ml-2">{{ measureItem.label }}</span>
            </div>
            <div>
              <span class="measureTypeIcon text-primaryBg mr-2"
                ><i :class="measureIconClasses[measureItem.type]"></i
              ></span>
            </div>
          </div>
        </div>
      </transition>
      <div v-if="$can('create', 'measure')" class="text-center">
        <b-button
          pill
          class="primaryBg mt-2 border-0"
          @click="createNewMeasure()"
          v-b-tooltip.hover.bottom
          title="Create New Measurement"
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
              <span><b>Type</b></span>
              <span>{{ clickedDetails.type }}</span>
            </div>
            <div class="d-flex justify-content-between">
              <span><b>Area</b></span>
              <span
                >{{ (clickedDetails.area * 0.000247105).toFixed(2) }} m<sup
                  >2</sup
                ></span
              >
            </div>
            <div class="d-flex justify-content-between">
              <span><b>Perimeter</b></span>
              <span
                >{{ (clickedDetails.length * 3.28084).toFixed(2) }} fts</span
              >
            </div>
            <div class="d-flex justify-content-between">
              <span><b>Created On</b></span>
              <span>{{ clickedDetails.creation_date }}</span>
            </div>
          </div>
          <div class="w-25 d-flex justify-content-center">
            <div
              role="button"
              class="text-light p-2"
              @click="downloadMeasure(clickedDetails)"
              v-b-tooltip.hover
              title="Download Measure"
            >
              <i class="fa fa-download"></i>
            </div>
            <div
              role="button"
              class="text-light p-2"
              v-if="$can('delete', 'measure')"
              v-b-tooltip.hover
              title="Delete Measurement"
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
import deleteConfirmModal from "../../../shared/deleteConfirmModal";
export default {
  name: "measureSideNav",
  components: { deleteConfirmModal },
  props: {
    measuresArray: Array,
  },
  data() {
    return {
      clickedDetailsVisible: false,
      clickedDetails: {},
      clickedItemKey: "",

      measureIconClasses: {
        poly: "fa fa-draw-polygon",
        line: "fa fa-slash",
        point: "far fa-dot-circle",
      },

      toBeDeleted: "",
      toBeDeletedId: "",
      deleteAOIApi: "airmapStore/deleteMeasureApi",
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
    measureItemClicked(measureItem) {
      this.clickedItemKey = this.currentDate + measureItem.label;
      this.clickedDetails = measureItem;
      this.clickedDetailsVisible = true;

      this.$root.$emit("measureItemClicked", measureItem);
    },
    closeDetails() {
      this.clickedDetails = {};
      this.clickedDetailsVisible = false;
    },
    downloadMeasure(measure) {
      this.$store.dispatch("airmapStore/downloadMeasureApi", measure.id);
    },
    showDeleteModal(measureItem) {
      this.toBeDeleted = measureItem.label;
      this.toBeDeletedId = measureItem.id;
      this.$bvModal.show("deleteConfirmModal");
    },
    createNewMeasure() {
      this.$root.$emit("createNewMeasure");
    },
    removeMeaure(measureLabel) {
      if (this.clickedDetails.label === measureLabel) {
        this.clickedDetails = {};
        this.clickedDetailsVisible = false;
      }
    },
  },
  mounted: function() {
    this.$root.$on("measureDeleted", (measureLabel) => {
      this.removeMeaure(measureLabel);
    });
  },
  destroyed: function() {
    if (this.callOnce) {
      this.callOnce = null;
      this.$root.$emit("measureClosed");
    }
  },
};
</script>

<style scoped>
.measureTypeIcon {
  font-size: 1.2em;
}
</style>
