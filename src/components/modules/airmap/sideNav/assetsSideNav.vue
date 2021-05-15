<template>
  <div>
    <div class="sidenavListContainer customScroll">
      <transition name="slide-fade" mode="out-in">
        <div :key="currentDate">
          <div
            class="d-flex justify-content-between sidenavListItem"
            :class="{
              clickedHighlighter: clickedAsset === currentDate + key + index,
            }"
            @click="renderDetails(key, index, asset)"
            v-for="(asset, key, index) in assetData"
            :key="index"
          >
            <div>
              {{ key.toLowerCase() | capitalize }}
            </div>
            <div>
              <i
                aria-hidden="true"
                :style="{ color: `rgb(${String(asset.color)})` }"
                class="fas fa-square float-right"
              ></i>
            </div>
          </div>
        </div>
      </transition>
      <transition name="fade">
        <div
          v-if="clickedDetailsVisible"
          class="d-flex flex-column sideBarDetailsContainer"
        >
          <div
            class="d-flex justify-content-between align-items-center bg-dark rounded-top"
          >
            <b class="ml-2 text-light">{{
              clickedDetails.title | capitalize
            }}</b>
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
            <div class="w-75 ">
              <div class="d-flex justify-content-around">
                <span><b>Area</b></span>
                <span>{{ clickedDetails.Area_m2 }} m<sup>2</sup></span>
              </div>
              <div class="d-flex justify-content-around">
                <span><b>Length</b></span>
                <span>{{ clickedDetails.Length_m }} m</span>
              </div>
            </div>
            <div class="w-25 d-flex justify-content-center">
              <div
                role="button"
                class="text-light p-2"
                @click="downloadAsset(clickedDetails)"
                v-b-tooltip.hover
                title="Download Kml"
              >
                <i class="fa fa-download"></i>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="text-center">
      <b-button
        pill
        class="primaryBg mt-2 border-0"
        @click="downloadSummary()"
        v-b-tooltip.hover
        title="Download CSV"
        ><i class="fa fa-download"></i
      ></b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "summarySideNav",
  props: ["assetData"],
  data() {
    return {
      clickedDetailsVisible: false,
      clickedDetails: {},
      clickedAsset: null,
    };
  },
  computed: {
    currentDate: function() {
      let currentDate = this.$store.state.airmapStore.currentDate;
      return currentDate ? currentDate : "";
    },
    kmlBaseUrl: function() {
      let kmlBaseUrl = this.$store.state.projectStore.projectProperties.kml;
      return kmlBaseUrl ? kmlBaseUrl : "";
    },
  },
  methods: {
    componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    },
    rgbToHex(r, g, b) {
      return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    },
    renderDetails(keyL2, keyL3, value) {
      this.clickedAsset = this.currentDate + keyL2 + keyL3;
      this.clickedDetails = value;
      let title = value.KML.split(".")[0].toLowerCase(); //The data from backend is all caps.
      this.clickedDetails.title = title ? title : "Details";
      this.clickedDetailsVisible = true;
    console.log(this.clickedDetails)
    // const rgb = value.color.substring(4, value.color.length-1)
    //      .replace(/ /g, '')
    //      .split(',');
        const r = parseInt(value.color[0])
        const g = parseInt(value.color[1])
        const b = parseInt(value.color[2])
      let hex_color =  this.rgbToHex(r,g,b)
      //TODO change this static url
      if (value.KML) {
        this.$root.$emit("kmlClicked", {
          url: `https://www.takvaviya.in/files/Airmap_kmls/Airmap%20Site1/02-06-2020/kml/${value.KML}`,
          color: String(value.color),  
          hex: hex_color,
        });
      }
    },
    closeDetails() {
      this.clickedDetails = {};
      this.clickedDetailsVisible = false;
      this.$root.$emit("removeKml");
    },
    downloadAsset(clickedAsset) {
      let url = `https://www.takvaviya.in/files/Airmap_kmls/Airmap%20Site1/02-06-2020/kml/${clickedAsset.KML}`;
      let filename = clickedAsset.KML.replace(/\s/g, "");
      this.$store.dispatch("projectStore/downloadFile", { url, filename });
    },
    downloadSummary() {
      this.$store.dispatch("airmapStore/downloadCompileApi", "downloadsummary");
    },
  },
  destroyed() {
    this.$root.$emit("removeKml");
  },
};
</script>

<style scoped></style>
