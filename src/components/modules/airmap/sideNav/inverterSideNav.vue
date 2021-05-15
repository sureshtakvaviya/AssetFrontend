<template>
  <div>
    <transition name="slide-fade" mode="out-in">
      <div :key="currentDate">
        <transition name="slide-fade" mode="out-in">
          <h4 class="text-center" :key="currentInverter">
            {{ currentInverter }}
          </h4>
        </transition>
        <div class="inverterListContainer customScroll">
          <!-- <transition name="slide-fade" mode="out-in">
            <div :key="currentDate">
              <div
                class="d-flex justify-content-between sidenavListItem"
                :class="{
                  clickedHighlighter:
                    clickedAsset === currentDate + key + index,
                }"
                @click="renderDetails(key, index, asset)"
                v-for="(asset, key, index) in inverterApiData.invertersData[
                  inverterCurrentPage
                ]"
                :key="index"
              >
                <div>
                  <div v-b-toggle="`dev${index}`" style="color: black">
                    {{ key.toLowerCase() | capitalize }}
                  </div>
                </div>
                <div>
                  <i
                    aria-hidden="true"
                    :style="{ color: `rgb(${String(asset.color)})` }"
                    class="fas fa-square float-right"
                  ></i>
                </div>
                <b-collapse
                  v-if="Object.values(asset).length >= 1"
                  :id="`dev${index}`"
                  class="mt-4"
                  style="margin-right: 30px"
                >
                  <div style="color: black">
                    <span>Actual : {{ asset.actual }}</span
                    ><br />
                    <span>Total : {{ asset.total }}</span>
                  </div>
                </b-collapse>
              </div>
            </div>
          </transition> -->
          <b-list-group>
            <b-list-group-item
              v-for="(itemL1, keyL1, indexL1) in inverterApiData.invertersData[
                inverterCurrentPage - 1
              ]"
              :key="keyL1"
            >
              <transition name="slide-fade" mode="out-in">
                <div class="sideBarList" :key="currentInverter">
                  <div v-b-toggle="`${currentInverter}${indexL1}L1`">
                    <span>{{ keyL1 }}</span>
                    <span>
                      <i :class="`fas fa-caret-down`" aria-hidden="true"></i>
                    </span>
                  </div>
                  <b-collapse
                    v-if="Object.keys(itemL1).length > 1"
                    :id="`${currentInverter}${indexL1}L1`"
                    class="mt-2"
                  >
                    <div
                      class="subItem1"
                      style="cursor: pointer"
                      v-for="(itemL2, keyL2, indexL2) in itemL1"
                      :key="`${keyL2}-${indexL2}`"
                    >
                      <div
                        v-b-toggle="`${currentInverter}${indexL1}${indexL2}L2`"
                      >
                        <span>
                          {{ keyL2 }}
                        </span>
                        <i 
                          aria-hidden="true"
                          :style="{ color: Object.values(itemL2)[0].color }"
                          class="fas fa-square float-right"
                        ></i>
                        <span
                          ><i
                            :class="`fas fa-caret-down`"
                            aria-hidden="true"
                          ></i
                        ></span>
                      </div>
                      <b-collapse
                        v-if="Object.keys(itemL2).length >= 1"
                        :id="`${currentInverter}${indexL1}${indexL2}L2`"
                        class="mt-2"
                      >
                        <div
                          class="subItem2"
                          v-for="(itemL3, keyL3, indexL3) in itemL2"
                          :key="`${keyL3}-${indexL3}`"
                          :class="{
                            clickedHighlighter:
                              clickedInverter === keyL2 + keyL3,
                          }"
                          @click="renderDetails(keyL2, keyL3, itemL3)"
                        >
                          <span>
                            {{ keyL3 }}
                          </span>
                        </div>
                      </b-collapse>
                    </div>
                  </b-collapse>
                </div>
              </transition>
            </b-list-group-item>
          </b-list-group>
        </div>
        <div class="inverterPaginator">
          <b-pagination
            :total-rows="inverterTotalPages"
            v-model="inverterCurrentPage"
            :per-page="1"
            align="center"
            @change="inverterPageChange"
            size="sm"
          ></b-pagination>
        </div>
        <transition name="fade">
          <div v-if="clickedDetailsVisible" class="sideBarDetailsContainer">
            <div class="clickedHeader">
              <span class="clickedTitle">Details</span>
              <span class="closeIcon">
                <i
                  class="icon fa fa-times"
                  aria-hidden="true"
                  aria-controls="sidebar"
                  @click="closeDetails()"
                ></i>
              </span>
            </div>
            <div class="clickedDetails">
              <!-- <div v-if="clickedDetails.Current_value !== '' && clickedDetails.Actual_value !== '' ">  -->
              <b-list-group-item>
                Current : {{ this.total }}
              </b-list-group-item>
              <b-list-group-item>
                Actual : {{ this.actual }}
              </b-list-group-item>
              <!-- </div> -->

              <!-- <div v-if="clickedDetails.total !== '' && clickedDetails.actual !== ''">
                <b-list-group-item>
                  Current : {{ clickedDetails.total }}
                </b-list-group-item>
                <b-list-group-item>
                  Actual : {{ clickedDetails.actual }}
                </b-list-group-item>

              </div> -->
            </div>
          </div>
        </transition>
      </div>
    </transition>
    <div class="text-center">
      <b-button
        pill
        class="primaryBg mt-2 border-0"
        @click="downloadInverter()"
        v-b-tooltip.hover
        title="Download CSV"
        ><i class="fa fa-download"></i
      ></b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "inverterSideNav",
  props: ["inverterApiData"],
  data() {
    return {
      clickedDetailsVisible: false,
      clickedDetails: {},
      clickedInverter: null,
      actual: {},
      total: {},

      inverterCurrentPage: 1,
    };
  },
  computed: {
    currentDate: function () {
      let currentDate = this.$store.state.airmapStore.currentDate;
      return currentDate;
    },
    inverterTotalPages: function () {
      let inverterPages = this.inverterApiData.inverters.length;

      return inverterPages ? inverterPages : 0;
    },
    kmlBaseUrl: function () {
      let kmlBaseUrl = this.$store.state.projectStore.projectProperties.kml;
      return kmlBaseUrl ? kmlBaseUrl : "";
    },
    currentInverter: function () {
      let currentInverter = this.inverterApiData.inverters[
        this.inverterCurrentPage - 1
      ];

      this.$root.$emit("kmlClicked", {
        url:
          `${this.kmlBaseUrl}` + "inverter/" + `${currentInverter}` + "/gb.kml",
        // color: String(rgb(255, 255, 255)),
      });

      return currentInverter ? currentInverter : {};
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
      this.clickedInverter = keyL2 + keyL3;
      this.clickedDetails = value;

      const rgb = value.color.substring(4, value.color.length-1)
         .replace(/ /g, '')
         .split(',');
        const r = parseInt(rgb[0])
        const g = parseInt(rgb[1])
        const b = parseInt(rgb[2])
      let hex_color =  this.rgbToHex(r,g,b)
      console.log(value.kml)

      if (value.actual || value.total) {
        console.log("a");
        this.actual = value.actual;
        this.total = value.total;
      } 
      
       else if (value.actual === 0 || value.total === 0) {
          console.log("fdsafhdjkhkl")
          this.actual = value.actual;
          this.total = value.total;
        }
        else { 
      
        this.actual = value.Actual_value;
        this.total = value.Current_value;
        }
    

      this.clickedDetailsVisible = true;
      // this.$store.dispatch("airmapStore/getKmlAPI");
      if (value) {
        if (value.kml) {
          this.$root.$emit("kmlClicked", {
            url:
              `${this.kmlBaseUrl}` +
              "inverter/" +
              `${this.currentInverter}` +
              "/gb.kml",
            // color: rgb(255, 255, 255),
          });
          this.$root.$emit("kmlClicked", {
            url:
              `${this.kmlBaseUrl}` +
              "inverter/" +
              `${this.currentInverter}/` +
              `${value.kml}`,
            color: String(value.color),
            hex: hex_color,
          });
        }
      }
    },
    closeDetails() {
      this.clickedDetails = {};
      this.clickedDetailsVisible = false;
            this.$root.$emit("removeKml");

    },
    inverterPageChange(page) {
      this.clickedInverter = "";
      this.inverterCurrentPage = page;
    },
    downloadInverter() {
      this.$store.dispatch(
        "airmapStore/downloadCompileApi",
        "downloadinverter"
      );
    },
    
  },
  destroyed() {
    this.$root.$emit("removeKml");
  },
};
</script>

<style scoped>
.inverterListContainer {
  max-height: 65vh;
  overflow: auto;
}
.sideBarList {
  display: flex;
  flex-direction: column;
  text-transform: capitalize;
  text-align: left;
  overflow-y: auto;
}
.subItem1 {
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  overflow: auto;
}
.subItem2 {
  padding: 10px;
  text-align: center;
}
.subItem2:hover {
  border: 1px solid rgba(0, 0, 0, 0.125);
}
.clickedHighlighter {
  background-color: var(--primaryBg);
  color: var(--light);
}
.inverterPaginator {
  margin-top: 20px;
}
.sideBarDetailsContainer {
  position: absolute;
  left: 350px;
  bottom: 100px;
  min-width: 400px;
  min-height: 180px;
  color: var(--dark);
  background-color: var(--light);
  box-shadow: 1px 1px var(--shadow);
  border-radius: 10px;
  transition: all 1s ease-in;
}
.sideBarDetailsContainer div:last-child {
  border-radius: 0 0 10px 10px;
}
.clickedHeader {
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
.clickedItemHeader {
  font-weight: bold;
  padding: 15px;
  border-bottom: 1.5px solid rgba(0, 0, 0, 0.125);
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for <2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
