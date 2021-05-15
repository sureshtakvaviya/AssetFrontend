<template>
  <div style="height: 100vh; width: 100%">
    <div class="timelineContainer">
      <b-dropdown text="Dates" dropright variant="dark" class="mx-2 primaryBg">
        <b-dropdown-item
          href="#"
          v-for="(date, index) in compare_date"
          :key="index"
          @click="getCompareData(date, 'left')"
          >{{ date }}</b-dropdown-item
        >
      </b-dropdown>
      <div>
        <b-button pill class="primaryBg border-0">{{ leftDate }}</b-button>
      </div>
      <div>
        <b-button pill class="primaryBg border-0">{{ rightDate }}</b-button>
      </div>

      <b-dropdown text="Dates" dropleft variant="dark" class="mx-2">
        <b-dropdown-item
          href="#"
          v-for="(date, index) in compare_date"
          :key="index"
          @click="getCompareData(date, 'right')"
          >{{ date }}</b-dropdown-item
        >
      </b-dropdown>
    </div>
    <div class="actionButtons1">
      <b-button
        @click="returnToMap"
        @mouseover="isBackButtonShowing = true"
        @mouseleave="isBackButtonShowing = false"
        variant="dark"
      >
        <i class="fas fa-arrow-left"></i>
        <transition name="slide-fade" mode="out-in">
          <span v-if="isBackButtonShowing" class="ml-1">Back To Map</span>
        </transition></b-button
      >

      <b-button @click="showCompareDetails" variant="dark">
        <i class="icon fa fa-bar-chart" aria-hidden="true"></i
      ></b-button>
    </div>
    <div class="actionButtons2 d-flex justify-content-end">
      <b-button
        @click="downloadCompare"
        variant="dark"
        v-b-tooltip.hover
        title="Download CSV"
      >
        <i class="fas fa-download" aria-hidden="true"></i
      ></b-button>
    </div>

    <l-map
      ref="compareMap"
      style="height: 100%; width: 100%"
      :zoom="zoom"
      :center="center"
      :options="{ maxZoom: 23, zoomControl: false }"
    >
      <l-tile-layer
        :options="{ maxZoom: 23 }"
        ref="baseLayerLeft"
        :url="baseUrlLeft"
      ></l-tile-layer>
      <l-tile-layer
        :options="{ maxZoom: 23 }"
        ref="baseLayerRight"
        :url="baseUrlRight"
      ></l-tile-layer>
      <l-tile-layer
        :options="{ maxZoom: 23 }"
        ref="rgbLayerLeft"
        :url="rgbUrlLeft"
      ></l-tile-layer>
      <l-tile-layer
        @ready="addCompareControl"
        :options="{ maxZoom: 23 }"
        ref="rgbLayerRight"
        :url="rgbUrlRight"
      ></l-tile-layer>
      <l-tile-layer
        :options="{ maxZoom: 23 }"
        ref="dsmLayerLeft"
        :url="dsmUrlLeft"
        :visible="isLeftDsm"
      ></l-tile-layer>
      <l-tile-layer
        :options="{ maxZoom: 23 }"
        ref="dsmLayerRight"
        :url="dsmUrlRight"
        :visible="isRightDsm"
      ></l-tile-layer>

      <l-control position="bottomright" v-if="dsmUrlRight">
        <b-button pill variant="dark">
          <b-form>
            <b-form-checkbox v-model="isRightDsm" name="check-button" switch>
              <b>DSM</b>
            </b-form-checkbox>
          </b-form>
        </b-button>
      </l-control>
      <l-control position="bottomleft" v-if="dsmUrlLeft">
        <b-button pill variant="dark">
          <b-form>
            <b-form-checkbox v-model="isLeftDsm" name="check-button" switch>
              <b>DSM</b>
            </b-form-checkbox>
          </b-form>
        </b-button>
      </l-control>
    </l-map>
    <b-modal
      size="xl"
      id="compareDetailsModal"
      title="Asset Comparison"
      :hide-footer="true"
    >
      <div v-if="projectType === 'Construction_Site'">
        <compareDetails />
      </div>
      <div v-else>
        <compareDetailsSolar />
      </div>
    </b-modal>
    <b-modal
      v-if="projectType === 'Solar_Site'"
      ref="my-modal"
      hide-footer
      title="SELECT YOUR TYPE"
      no-close-on-backdrop
    >
      <div class="d-block text-center"></div>
      <b-button block @click="hideModal('SCPM')">SCPM</b-button>
      <b-button block @click="hideModal('SCQM')">SCQM</b-button>
      <b-button block @click="hideModal('SCQM+SCPM')">SCPM+SCQM</b-button>

      <!-- <b-button class="mt-3" variant="outline-danger" block @click="hideModal">Close Me</b-button>
      <b-button class="mt-2" variant="outline-warning" block @click="toggleModal">Toggle Me</b-button> -->
    </b-modal>
  </div>
</template>

<script>
//TODO reload issue getProject
// import $ from "jquery"
import L from "leaflet";
import "@/assets/js/leaflet-side-by-side";
import { LMap, LTileLayer, LControl } from "vue2-leaflet";
import { mapState } from "vuex";
import compareDetailsSolar from "./compareDetailsSolar";
import compareDetails from "./compareDetails";

export default {
  name: "compareMaps",
  components: {
    LMap,
    LTileLayer,
    LControl,
    compareDetails,
    compareDetailsSolar,
  },

  data() {
    return {
      baseUrlRight: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      baseUrlLeft: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      bounds: null,
      map: null,
      isLeftDsm: false,
      isRightDsm: false,
      leftDsmZIndex: 0,
      rightDsmZIndex: 0,
      compareControl: null,

      baseLayerLeft: null,
      baseLayerRight: null,
      rgbLayerLeft: null,
      rgbLayerRight: null,
      dsmLayerLeft: null,
      dsmLayerRight: null,
      isBackButtonShowing: false,

      compare_date: [],
    };
  },
  computed: {
    ...mapState({
      projectType: (state) => state.projectStore.projectType,
      center: (state) => state.airmapStore.mapOptions.center,
      zoom: (state) => state.airmapStore.mapOptions.zoom,
      leftDate: (state) => state.projectStore.compareDataLeft.date,
      rightDate: (state) => state.projectStore.compareDataRight.date,

      rgbLeft: (state) =>
        state.projectStore.compareDataLeft.project_properties.ortho.RGB,
      rgbRight: (state) =>
        state.projectStore.compareDataRight.project_properties.ortho.RGB,
          drgbLeft: (state) => state.projectStore.compareDataLeft.project_properties.deviation_ortho.RGB,
        drgbRight: (state) => state.projectStore.compareDataRight.project_properties.deviation_ortho.RGB,
      dsmLeft: (state) =>
        state.projectStore.compareDataLeft.project_properties.ortho.DSM,
      dsmRight: (state) =>
        state.projectStore.compareDataRight.project_properties.ortho.DSM,
    }),
    dsmUrl: function () {
      return this.dsm ? `${this.dsm}{z}/{x}/{y}.png` : "";
    },
     rgbUrlLeft: function () {
      console.log(this.drgbLeft)
      if(this.rgbLeft === ""){
        return this.drgbLeft ? `${this.drgbLeft}{z}/{x}/{y}.png` : "";
      }
      else{
      return this.rgbLeft ? `${this.rgbLeft}{z}/{x}/{y}.png` : "";

      }

    },
    rgbUrlRight: function () {
       if(this.rgbRight === ""){
        return this.drgbRight ? `${this.drgbRight}{z}/{x}/{y}.png` : "";
      }
      else{
      return this.rgbRight ? `${this.rgbRight}{z}/{x}/{y}.png` : "";

      }

    },
    dsmUrlLeft: function () {
      return this.dsmLeft ? `${this.dsmLeft}{z}/{x}/{y}.png` : "";
    },
    dsmUrlRight: function () {
      return this.dsmRight ? `${this.dsmRight}{z}/{x}/{y}.png` : "";
    },
    datesArray: function () {
      var dates_array = [];

      if (this.$store.state.projectStore.projectType === "Construction_Site") {
        for (var k in this.$store.state.projectStore.datesArray) {
          dates_array.push(this.$store.state.projectStore.datesArray[k]);
        }
      } else {
        for (var i in this.$store.state.projectStore.datesArray) {
          dates_array.push(this.$store.state.projectStore.datesArray[i].date);
        }
      }

      return dates_array;

      // return this.$store.state.projectStore.datesArray;
    },
  },

  methods: {
    showModal() {
      this.$refs["my-modal"].show();
    },
    hideModal(pro_type) {
      this.$refs["my-modal"].hide();
      if (pro_type === "SCPM") {
        //changing solar_pro_type to SCPM if selected is SCPM
        this.$store.state.projectStore.solar_pro_type = pro_type;
        for (var m in this.$store.state.projectStore.datesArray) {
          if (this.$store.state.projectStore.datesArray[m].type === "SCPM") {
            this.$data.compare_date.push(
              this.$store.state.projectStore.datesArray[m].date
            );
          }
        }
      } else if (pro_type === "SCQM") {
        //changing solar_pro_type to SCQM if selected is SCQM
        this.$store.state.projectStore.solar_pro_type = pro_type;
        for (var n in this.$store.state.projectStore.datesArray) {
          if (this.$store.state.projectStore.datesArray[n].type === "SCQM") {
            this.$data.compare_date.push(
              this.$store.state.projectStore.datesArray[n].date
            );
          }
        }
      } else if (pro_type === "SCQM+SCPM") {
        this.$store.state.projectStore.solar_pro_type = pro_type;
        for (var o in this.$store.state.projectStore.datesArray) {
          if (
            this.$store.state.projectStore.datesArray[o].type === "SCQM+SCPM"
          ) {
            this.$data.compare_date.push(
              this.$store.state.projectStore.datesArray[o].date
            );
          }
        }
      }
    },

    addCompareControl() {
      this.map = this.$refs.compareMap.mapObject;
      this.baseLayerLeft = this.$refs.baseLayerLeft.mapObject;
      this.baseLayerRight = this.$refs.baseLayerRight.mapObject;
      this.rgbLayerLeft = this.$refs.rgbLayerLeft.mapObject;
      this.rgbLayerRight = this.$refs.rgbLayerRight.mapObject;
      this.dsmLayerLeft = this.$refs.dsmLayerLeft.mapObject;
      this.dsmLayerRight = this.$refs.dsmLayerRight.mapObject;
      this.compareControl = L.control
        .sideBySide(
          [this.baseLayerLeft, this.rgbLayerLeft, this.dsmLayerLeft],
          [this.baseLayerRight, this.rgbLayerRight, this.dsmLayerRight],
          { padding: 100 }
        )
        .addTo(this.map);
    },
    getCompareData(date, side) {
      if (side === "left") {
        let setData = { date: date, side: "left" };
        this.$store.dispatch("projectStore/setCompareData", setData);
      } else {
        let setData = { date: date, side: "right" };
        this.$store.dispatch("projectStore/setCompareData", setData);
      }
    },
    showCompareDetails() {
      this.$bvModal.show("compareDetailsModal");
    },
    downloadCompare() {
      this.$store
        .dispatch("airmapStore/downloadCompareApi", this.leftDate)
        .then((response) => {
          if (response === "success") {
            this.$store.dispatch(
              "airmapStore/downloadCompareApi",
              this.rightDate
            );
          }
        });
    },
    returnToMap() {
      this.$router.go(-1);
    },
  },

  destroyed() {
    let setData = { date: this.datesArray[0], side: "left" };
    this.$store.dispatch("projectStore/setCompareData", setData);
    setData.side = "right";
    this.$store.dispatch("projectStore/setCompareData", setData);
  },
  mounted() {
    if (this.$store.state.projectStore.projectType === "Construction_Site") {
      console.log("0");
      for (var k in this.$store.state.projectStore.datesArray) {
        this.$data.compare_date.push(
          this.$store.state.projectStore.datesArray[k]
        );
      }
    } else {
      this.showModal();
    }
  },
};
</script>

<style scoped>
#app {
  height: 0%;
}
.sub-menu {
  position: absolute;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
}
.timelineContainer {
  position: absolute;
  top: 20px;
  width: 100%;
  z-index: 999;
  display: flex;
  justify-content: space-between;
}
.actionButtons1 {
  position: absolute;
  top: 100px;
  left: 5px;
  width: 99%;
  z-index: 999;
  display: flex;
  justify-content: space-between;
}
.actionButtons2 {
  position: absolute;
  top: 200px;
  left: 5px;
  width: 99%;
  z-index: 999;
}
.backToMap {
  transition: all 0.5s ease;
}
.timelineContainer >>> .dropdown-menu.show {
  display: block;
  max-height: 45vh;
  overflow: auto;
}
</style>
