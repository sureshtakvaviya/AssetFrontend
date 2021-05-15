<template>
  <div>
    <div class="sidenavListContainer">
      <transition name="slide-fade" mode="out-in">
        <div :key="currentDate">
          <div
            class="d-flex justify-content-between sidenavListItem"
            v-for="(cadItem, key, index) in cadArray"
            :key="index"
            :class="{
              clickedHighlighter:
                clickedItemKey === currentDate + cadItem.id,
            }"
            @click="cadItemClicked(cadItem)"
          >
            <div>
              <span class="ml-2">{{ cadItem.label }}</span>
            </div>
          </div>
        </div>
      </transition>
      <div v-if="$can('create', 'cad')" class="text-center">
        <b-button
          pill
          class="primaryBg mt-2 border-0"
          @click="uploadNewCad()"
          v-b-tooltip.hover
          title="Upload New CAD"
          ><i class="fa fa-upload"></i
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
        <div
          class="sideBarDetails d-flex align-items-center rounded-bottom py-2"
        >
          <div class="w-75 px-3 py-2">
            <div class="d-flex justify-content-between">
              <span><b>Uploaded On</b></span>
              <span>{{ clickedDetails.creation_date | dateFormat('YYYY-DD-MM') }}</span>
            </div>
            <div class="d-flex justify-content-between">
              <span><b>Uploaded By</b></span>
              <span>{{ clickedDetails.uploaded_by | capitalize }}</span>
            </div>
            <div v-if="clickedDetails.realign_date" class="d-flex justify-content-between">
              <span><b>Realigned On</b></span>
              <span>{{ clickedDetails.realign_date | dateFormat('YYYY-DD-MM') }}</span>
            </div>
            <div v-if="clickedDetails.realigned_by" class="d-flex justify-content-between">
              <span><b>Realigned By</b></span>
              <span>{{ clickedDetails.realigned_by | capitalize }}</span>
            </div>
          </div>
          <div class="w-25 d-flex justify-content-center">
            <div
              v-if="isRealigned"
              role="button"
              class="text-light p-2"
              @click="revertReAlign(clickedDetails)"
              v-b-tooltip.hover
              title="Revert Align"
            >
              <i class="fas fa-history"></i>
            </div>
            <div
              v-else
              role="button"
              class="text-light p-2"
              @click="reAlignCad(clickedDetails)"
              v-b-tooltip.hover
              title="Re-align CAD"
            >
              <i class="fa fa-arrows-alt"></i>
            </div>
            <div
              role="button"
              class="text-light p-2"
              v-if="$can('delete', 'cad')"
              v-b-tooltip.hover
              title="Delete CAD"
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
        :deleteAPI="deleteCadApi"
      />
    </b-modal>
  </div>
</template>

<script>
import deleteConfirmModal from "../../../shared/deleteConfirmModal";
export default {
  name: "cadAlignSideNav",
  components: { deleteConfirmModal },
  props: {
    cadArray: Array,
  },
  data() {
    return {
      clickedDetailsVisible: false,
      clickedDetails: {},
      clickedItemKey: "",
      isRealigned: false,

      toBeDeleted: "",
      toBeDeletedId: "",
      deleteCadApi: "airmapStore/deleteCadAlignApi",
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
    cadItemClicked(cadItem) {
      this.isRealigned = cadItem.realign_cad_kml.length > 0 ? true : false;
      this.clickedItemKey = this.currentDate + cadItem.id;
      this.clickedDetails = cadItem;
      this.clickedDetailsVisible = true;

      if (cadItem) {
        this.$root.$emit("cadClicked", cadItem);
      }
    },
    closeDetails() {
      this.clickedDetails = {};
      this.clickedDetailsVisible = false;
    },
    showDeleteModal(cadItem) {
      this.toBeDeleted = cadItem.label;
      this.toBeDeletedId = cadItem.id;
      this.$bvModal.show("deleteConfirmModal");
    },
    uploadNewCad() {
      this.$bvModal.show("cadUploadModal");
    },
    reAlignCad(cadItem) {
      if (cadItem) {
        this.$root.$emit("reAlignClicked", cadItem);
      }
    },
    revertReAlign(cadItem) {
      if (cadItem) {
        this.$root.$emit("revertReAlignClicked", cadItem);
      }
    },
  },
  mounted() {
    this.$root.$on("cadUploaded", (uploadedCad) => {
      if (uploadedCad) {
        this.cadItemClicked(uploadedCad)
      }
    });
    this.$root.$on("cadAligned", (reAlignedCad) => {
      if (reAlignedCad.id === this.clickedDetails.id) {
        this.isRealigned = true;
        reAlignedCad.label = this.clickedDetails.label;
        reAlignedCad.uploaded_cad_kml = this.clickedDetails.uploaded_cad_kml;
        this.cadItemClicked(reAlignedCad)
      }
    });
    this.$root.$on("cadAlignReverted", (originalCad) => {
      if (originalCad.id === this.clickedDetails.id) {
        this.clickedDetails.realigned_by = null,
        this.clickedDetails.realign_date = null,
        this.isRealigned = false;
      }
    });
    this.$root.$on("cadDeleted", (cadLabel) => {
      if (cadLabel === this.clickedDetails.label) {
        this.clickedDetails = {};
        this.clickedDetailsVisible = false;
      }
    });
  },
  beforeDestroy: function() {
    this.$root.$emit("cadSideNavClosed");
  },
};
</script>

<style scoped>
.cadAlignList {
  max-height: 700px;
  overflow: auto;
}
.cadItemContainer {
  display: flex;
}
.cadItemContent {
  flex: 2;
  text-align: left;
  cursor: pointer;
}
.cadAlignDeleteIcon {
  align-self: center;
  cursor: pointer;
}
.createButton {
  align-self: center;
  border-radius: 50%;
  margin-top: 10px;
}
</style>
