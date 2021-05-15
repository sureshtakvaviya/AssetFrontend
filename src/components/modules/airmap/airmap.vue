<template>
  <div style="height: 100vh; width: 100%">
    <l-map
      ref="map"
      style="height: 100%; width: 100%"
      :zoom="zoom"
      :center="center"
      :options="{ maxZoom: 23, zoomControl: false }"
      @draw:created="aoiCreated"
      @measurefinish="measureCreated"
      @ready="mapLayersInit"
    >
      <l-tile-layer
        :options="{ maxZoom: 23 }"
        ref="baselayer"
        :url="url"
      ></l-tile-layer>
      <l-tile-layer
        :options="{ maxZoom: 23 }"
        ref="baselayer"
        :url="rgbUrl"
      ></l-tile-layer>
      <l-tile-layer
        v-if="isDsm"
        :options="{ maxZoom: 23 }"
        ref="baselayer"
        :url="dsmUrl"
      ></l-tile-layer>
      <l-control position="bottomright" v-if="dsmUrl">
        <div
          id="dsmSwitch"
          class="transparentBg d-flex justify-content-center align-items-center rounded"
        >
          <b-form-checkbox
            role="button"
            v-model="isDsm"
            name="check-button"
            switch
          >
          </b-form-checkbox>
          <b>DSM</b>
        </div>
      </l-control>
      <l-control-zoom v-if="false" position="bottomleft"></l-control-zoom>
      <l-draw-toolbar v-if="isDraw" position="topright" />
    </l-map>
    <b-modal id="polygon-modal" title="Range Definition" :hide-footer="true">
      <drawModal :polyDimensionProp="drawnPolygonDimension" />
    </b-modal>
    <b-modal id="measureModal" title="Measurement Details" :hide-footer="true">
      <measureModal :measureDetails="measureDetails" />
    </b-modal>
    <b-modal id="cadUploadModal" title="Upload CAD File" :hide-footer="true">
      <cadUploadModal />
    </b-modal>
    <b-modal
      @hidden="closeCadDetails"
      id="cadAlignModal"
      title="CAD Alignment"
      :hide-footer="true"
    >
      <cadAlignModal :cadAlignProp="cadAlignData" />
    </b-modal>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import L from "leaflet";
import "leaflet-measure";
import "@/assets/js/L.KML.js";
import { LMap, LTileLayer, LControlZoom, LControl } from "vue2-leaflet";
import LDrawToolbar from "vue2-leaflet-draw-toolbar";
import { mapState } from "vuex";

import drawModal from "./drawModal";
import measureModal from "./measureModal";
import cadUploadModal from "./cadUploadModal";
import cadAlignModal from "./cadAlignModal";
cadAlignModal;
export default {
  name: "airmap",
  components: {
    LMap,
    LTileLayer,
    LControlZoom,
    LControl,
    LDrawToolbar,
    drawModal,
    measureModal,
    cadUploadModal,
    cadAlignModal,
  },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      bounds: null,
      map: null,

      isDraw: false,
      isDsm: false,

      aoiLayer: null,
      aoiLayerLabelMap: new Map(),
      createdAoi: null,
      drawnPolygonDimension: [],
      drawControl: null,
      polygonEnabler: null,

      kmlLayer: null,

      measureDetails: null,
      measureControl: null,
      createdMeasure: null,
      measureLayer: null,
      measureLayerLabelMap: new Map(),

      isRealigned: false,
      cadLayer: null,
      cadLayerLabelMap: new Map(),
      cadFileLastModified: "",
      cadAlignData: { id: "", label: "", alignPoints: [] },
    };
  },
  computed: {
    ...mapState({
      center: (state) => state.airmapStore.mapOptions.center,
      zoom: (state) => state.airmapStore.mapOptions.zoom,
      currentKML: (state) => state.airmapStore.currentKML,
      currentCad: (state) => state.airmapStore.currentCad,
      dsm: (state) => state.projectStore.projectProperties.ortho.DSM,
      rgb: (state) => state.projectStore.projectProperties.ortho.RGB,
      rgb_dev: (state) =>
        state.projectStore.projectProperties.deviation_ortho.RGB,
    }),
    dsmUrl: function () {
      return this.dsm ? `${this.dsm}{z}/{x}/{y}.png` : "";
    },
    rgbUrl: function () {
      if (this.rgb_dev && this.rgb === "") {
        return this.rgb_dev ? `${this.rgb_dev}{z}/{x}/{y}.png` : "";
      }

      else if (this.rgb !== " ") {
        return this.rgb ? `${this.rgb}{z}/{x}/{y}.png` : "";
      }
      else{
        return this.rgb ? `${this.rgb}{z}/{x}/{y}.png` : "";
      }
    },
  },

  watch: {},

  methods: {
    mapLayersInit() {
      //Initialize all the objects
      this.map = this.$refs.map.mapObject;
      this.kmlLayer = new L.featureGroup().addTo(this.map);

      //Aoi Layer
      this.aoiLayer = new L.FeatureGroup().addTo(this.map);
      this.drawControl = new L.Control.Draw({
        position: "topright",
        draw: {
          polyline: false,
          polygon: true,
          circle: true,
          marker: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: this.aoiLayer,
          remove: true,
        },
      });

      //Measure Layer
      this.measureLayer = new L.FeatureGroup().addTo(this.map);
      this.measureControl = new L.Control.Measure({
        position: "topright",
        activeColor: "#f14141",
        completedColor: "#ff7800",
        primaryLengthUnit: "feet",
        primaryAreaUnit: "acres",
        secondaryLengthUnit: undefined,
        secondaryAreaUnit: undefined,
        units: {
          feet: {
            factor: 3.28084,
            display: "feets",
            decimals: 2,
          },
          acres: {
            factor: 0.000247105,
            display: "acres",
            decimals: 2,
          },
        },
      });

      //Cad Layer
      this.cadLayer = new L.featureGroup().addTo(this.map);
    },

    //All Geodata related layer rendering
    renderGeoData(url, featureLayer, kmlColor = "",hex) {
      if (url) {
        let fileFormat = url.split(".").slice(-1)[0];
        let dataLayer = null;
        let customLayer = null;
       

        if (kmlColor) {
          customLayer = L.geoJson(null, {
            style: function (feature) {
              return {
                color: hex,
                fill: 1,
                fillColor: `rgb(${kmlColor})`,
                fillOpacity: 0.5,
              };
            },
          });
        }
        //More formats can be added as cases below; Check leaflet-omnivore docs for supported formats
        switch (fileFormat) {
          case "kml":
            {
              dataLayer = omnivore.kml(url, null, customLayer);
            }
            break;
          default:
            break;
        }
        dataLayer.on("ready", () => {
          featureLayer.addLayer(dataLayer);
          // Adjust map to show the kml
          const bounds = dataLayer.getBounds();
          this.map.fitBounds(bounds);
        });
        return dataLayer;
      }
    },

    //Aoi Methods
    createNewAOI() {
      this.map.addControl(this.drawControl);
      this.polygonEnabler = new L.Draw.Polygon(
        this.map,
        this.drawControl.options.polygon
      );
      this.polygonEnabler.enable();
    },
    aoiCreated(event) {
      this.createdAoi = event.layer;
      this.drawnPolygonDimension = event.layer._latlngs[0];
      this.$bvModal.show("polygon-modal");
      this.map.removeControl(this.drawControl);
    },
    renderNewAoi(aoiLabel) {
      this.aoiLayerLabelMap.set(aoiLabel, this.createdAoi);
      let popup = L.popup().setContent(aoiLabel);
      this.createdAoi.bindPopup(popup).openPopup();
      this.aoiLayer.addLayer(this.createdAoi);

      this.$bvToast.toast(`${aoiLabel} created successfully`, {
        title: "AOI Created",
        autoHideDelay: 4000,
        appendToast: false,
        variant: "success",
      });
    },
    renderAOIItem(aoi) {
      //Add the layer if it's not already shown
      if (!this.aoiLayerLabelMap.has(aoi.label)) {
        let existingAOI = L.polygon(aoi.polygon, {
          color: "#ff7800",
          weight: 1,
        });
        this.aoiLayerLabelMap.set(aoi.label, existingAOI);
        let popup = L.popup().setContent(aoi.label);
        existingAOI.bindPopup(popup).openPopup();
        this.aoiLayer.addLayer(existingAOI);
        const bounds = this.aoiLayer.getBounds();
        this.map.fitBounds(bounds);
      } else {
        //If user tries to add an existing aoi again move to the aoi and open popup
        let aoiItem = this.aoiLayerLabelMap.get(aoi.label);
        const bounds = aoiItem.getBounds();
        this.map.fitBounds(bounds);
        aoiItem.openPopup();
      }
    },
    removeAoi(aoiLabel) {
      if (this.aoiLayerLabelMap.has(aoiLabel)) {
        let deletedAoi = this.aoiLayerLabelMap.get(aoiLabel);
        this.aoiLayer.removeLayer(deletedAoi);
        this.aoiLayerLabelMap.delete(aoiLabel);
      }
      this.$bvToast.toast(`${aoiLabel} aoi deleted successfully`, {
        title: "Deleted!",
        autoHideDelay: 4000,
        appendToast: false,
        variant: "success",
      });
    },
    closeAOI() {
      this.aoiLayer ? this.aoiLayer.clearLayers() : "";
      this.map.removeControl(this.drawControl);
      if (this.polygonEnabler) this.polygonEnabler.disable();
      this.aoiLayerLabelMap.clear();
    },

    //Measure Methods
    createNewMeasure() {
      this.map.addControl(this.measureControl);
      let createNewButton = document.getElementsByClassName("start")[0];
      createNewButton.click();
    },
    renderNewMeaure(measureLabel) {
      this.measureLayerLabelMap.set(measureLabel, this.createdMeasure);
      let popup = L.popup().setContent(measureLabel);
      this.createdMeasure.bindPopup(popup).openPopup();
      this.measureLayer.addLayer(this.createdMeasure);

      this.$bvToast.toast(`${measureLabel} created successfully`, {
        title: "AOI Created",
        autoHideDelay: 4000,
        appendToast: false,
        variant: "success",
      });
    },
    measureCreated(measureEvent) {
      if (measureEvent.data.points.length > 0) {
        this.measureDetails = measureEvent.data;
        this.createdMeasure = measureEvent.layer.getLayers()[0];
        this.$bvModal.show("measureModal");
        this.map.removeControl(this.measureControl);
      }
    },
    renderMeasureItem(measureItem) {
      //Add the layer if it's not already shown
      if (!this.measureLayerLabelMap.has(measureItem.label)) {
        let existingMeasure = L.polygon(measureItem.polygon, {
          color: "#ff7800",
          weight: 1,
        });
        this.measureLayerLabelMap.set(measureItem.label, existingMeasure);
        let popup = L.popup().setContent(measureItem.label);
        existingMeasure.bindPopup(popup).openPopup();
        this.measureLayer.addLayer(existingMeasure);
        const bounds = this.measureLayer.getBounds();
        this.map.fitBounds(bounds);
      } else {
        //If user tries to add an existing meaureItem again move to the measureItem and open popup
        let existingMeasure = this.measureLayerLabelMap.get(measureItem.label);
        const bounds = existingMeasure.getBounds();
        this.map.fitBounds(bounds);
        existingMeasure.openPopup();
      }
    },
    removeMeaure(measureLabel) {
      if (this.measureLayerLabelMap.has(measureLabel)) {
        let deletedMeasure = this.measureLayerLabelMap.get(measureLabel);
        this.measureLayer.removeLayer(deletedMeasure);
        this.measureLayerLabelMap.delete(measureLabel);
      }
      this.$bvToast.toast(`${measureLabel} deleted successfully`, {
        title: "Deleted!",
        autoHideDelay: 4000,
        appendToast: false,
        variant: "success",
      });
    },
    closeMeasure() {
      this.map.removeControl(this.measureControl);
      this.measureLayer ? this.measureLayer.clearLayers() : "";
      this.measureLayerLabelMap.clear();
    },

    //Cad Methods
    renderCad(cad) {
      if (!this.cadLayerLabelMap.has(cad.label)) {
        let cadLayer;
        let cadLayers = [];
        let cadUrlArray = [];
        if (cad.realign_cad_kml.length > 0) {
          cadUrlArray = cad.realign_cad_kml;
          this.isRealigned = true;
        } else {
          cadUrlArray = cad.uploaded_cad_kml;
          this.isRealigned = false;
        }
        cadUrlArray.forEach((url) => {
          cadLayer = this.renderGeoData(url, this.cadLayer, cad.color);
          cadLayers.push(cadLayer);
        });
        this.cadId = cad.id;
        this.cadLayerLabelMap.set(cad.label, cadLayers);
      } else {
        //If user tries to add an existing cad again move to the cad and open popup
        let cadLayers = this.cadLayerLabelMap.get(cad.label);
        const bounds = cadLayers[0].getBounds();
        this.map.fitBounds(bounds);
      }
      this.cadAlignData.label = cad.label;
      this.cadAlignData.id = cad.id;
    },
    reAlignCad(cadItem) {
      this.cadAlignData.label = cadItem.label;
      this.cadAlignData.id = cadItem.id;
      L.DomUtil.addClass(this.map._container, "crosshair-cursor-enabled");
      this.map.on("click", (mapClick) => {
        this.addCadAlignPoints(mapClick.latlng);
      });
    },
    revertRealign(cadItem) {
      this.$store
        .dispatch("airmapStore/revertRealignApi", cadItem.id)
        .then((response) => {
          if (response === "success") {
            let originalCad = {
              creation_date: cadItem.creation_date,
              date: cadItem.date,
              id: cadItem.id,
              label: cadItem.label,
              location_id: cadItem.location_id,
              project: cadItem.project,
              uploaded_cad_kml: cadItem.uploaded_cad_kml,
              realign_cad_kml: [],
              realigned_by: null,
              realign_date: null,
            };
            this.cadLayer.clearLayers();
            this.cadLayerLabelMap.clear();
            this.renderCad(originalCad);
            this.$root.$emit("cadAlignReverted", originalCad);
          }
        });
    },
    addCadAlignPoints(latlng) {
      let newMarker = new L.marker(latlng);
      this.cadLayer.addLayer(newMarker);
      this.cadAlignData.alignPoints.push(latlng);
      if (this.cadAlignData.alignPoints.length >= 8) {
        this.$bvModal.show("cadAlignModal");
      }
    },
    removeCad(cadLabel) {
      if (this.cadLayerLabelMap.has(cadLabel)) {
        this.cadLayer.clearLayers();
        this.measureLayerLabelMap.delete(cadLabel);

        this.$bvToast.toast(`${cadLabel} deleted successfully`, {
          title: "Deleted!",
          autoHideDelay: 4000,
          appendToast: false,
          variant: "success",
        });
      }
    },
    closeCadDetails() {
      L.DomUtil.removeClass(this.map._container, "crosshair-cursor-enabled");
      this.cadLayer ? this.cadLayer.clearLayers() : "";
      this.cadAlignData.alignPoints = [];
      this.cadAlignData.label = "";
      this.cadFileLastModified = "";
      this.map.off("click");
    },
  },
  mounted() {
    this.$root.$on("kmlClicked", (kml) => {
      this.kmlLayer.clearLayers();
      this.renderGeoData(kml.url, this.kmlLayer, kml.color,kml.hex);
    });
    this.$root.$on("removeKml", () => {
      this.kmlLayer.clearLayers();
    });

    this.$root.$on("createNewAoi", () => {
      this.createNewAOI();
    });
    this.$root.$on("aoiCreated", (aoiLabel) => {
      this.renderNewAoi(aoiLabel);
    });
    this.$root.$on("aoiItemClicked", (aoi) => {
      this.renderAOIItem(aoi);
    });
    this.$root.$on("aoiClosed", () => {
      this.closeAOI();
    });
    this.$root.$on("aoiDeleted", (aoiLabel) => {
      this.removeAoi(aoiLabel);
    });

    this.$root.$on("createNewMeasure", () => {
      this.createNewMeasure();
    });
    this.$root.$on("measureCreated", (measureLabel) => {
      this.renderNewMeaure(measureLabel);
    });
    this.$root.$on("measureItemClicked", (measureItem) => {
      this.renderMeasureItem(measureItem);
    });
    this.$root.$on("measureDeleted", (measureLabel) => {
      this.removeMeaure(measureLabel);
    });
    this.$root.$on("measureClosed", () => {
      this.closeMeasure();
    });

    this.$root.$on("cadClicked", (cad) => {
      this.cadLayer.clearLayers();
      this.cadLayerLabelMap.clear(); //TODO exact workflow for multiple cad operations
      this.renderCad(cad);
    });
    this.$root.$on("cadSideNavClosed", () => {
      this.closeCadDetails();
    });
    this.$root.$on("cadDeleted", (cadLabel) => {
      this.removeCad(cadLabel);
    });
    this.$root.$on("reAlignClicked", (cadItem) => {
      this.reAlignCad(cadItem);
    });
    this.$root.$on("revertReAlignClicked", (cadItem) => {
      this.revertRealign(cadItem);
    });
  },
};
</script>

<style scoped>
.layer-measurearea {
  background-color: red;
}
.cadDetailsContainer {
  position: absolute;
  left: 350px;
  bottom: 25px;
  min-width: 200px;
  min-height: 125px;
  display: flex;
  flex-direction: column;
  color: var(--dark);
  background-color: var(--light);
  box-shadow: 1px 1px var(--shadow);
  border-radius: 10px;
  transition: all 1s ease-in;
  z-index: 999;
  text-align: center;
}

.cadHeaderContainer {
  display: flex;
  justify-content: space-between;
  background-color: var(--primaryBg);
  color: var(--light);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.clickedTitle {
  font-size: 1.3em;
  padding: 10px;
}
.closeIcon {
  padding: 10px;
  transition: all 0.2s;
}
.closeIcon:hover {
  transform: scale(1.2);
}

#dsmSwitch {
  width: 6rem;
  height: 2.5rem;
  color: var(--light);
}

.leaflet-container.crosshair-cursor-enabled {
  cursor: crosshair;
}
</style>
