<template>
  <div>
    <div class="summaryListContainer customScroll">
      <!-- <b-list-group>
            <b-list-group-item
              v-for="(itemL1, keyL1, indexL1) in summaryData"
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
                      style="cursor: pointer;"
                      v-for="(itemL2, keyL2, indexL2) in itemL1"
                      :key="`${keyL2}-${indexL2}`"
                    >
                      <div
                        v-b-toggle="`${currentInverter}${indexL1}${indexL2}L2`"
                      >
                        <span>
                          {{ keyL2 }}
                        </span>
                        <span
                          ><i
                            :class="`fas fa-caret-down`"
                            aria-hidden="true"
                          ></i
                        ></span>
                      </div>
                      <b-collapse
                        v-if="Object.keys(itemL2).length >=1"
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
          </b-list-group> -->
      <b-list-group>
        <b-list-group-item
          v-for="(itemL1, keyL1, indexL1) in summaryData"
          :key="indexL1"
        >
          <transition name="slide-fade" mode="out-in">
            <div class="sideBarList" :key="currentDate">
              <div v-b-toggle="`summary${indexL1}L1`">
                <span>{{ keyL1 }}</span>
                <span>
                  <i :class="`fas fa-caret-down`" aria-hidden="true"></i>
                </span>
              </div>
              <b-collapse
                v-if="Object.keys(itemL1).length > 1"
                :id="`summary${indexL1}L1`"
                class="mt-2"
              >
                <div
                  class="subItem1"
                  style="cursor: pointer"
                  v-for="(itemL2, keyL2, indexL2) in itemL1"
                  :key="`${keyL2}-${indexL2}`"
                >
                  <div v-b-toggle="`${indexL1}${indexL2}L2`">
                    <span
                      v-if="keyL2 === 'Complete' || keyL2 === 'Incomplete'"
                      @click="renderDetails(keyL1, keyL2, itemL2)"
                    >
                      {{ keyL2 }}

                      <i
                        aria-hidden="true"
                        :style="{ color: itemL2.color }"
                        class="fas fa-square float-right"
                      ></i>
                    </span>

                    <span v-else-if="keyL2 === 'AC Cable'">
                      {{ keyL2 }}
                      <i
                        aria-hidden="true"
                        :style="{ color: itemL2.trench.color }"
                        class="fas fa-square float-right"
                      ></i>
                    </span>
                    <span v-else-if="keyL2 === 'DC Cable'">
                      {{ keyL2 }}
                      <i
                        aria-hidden="true"
                        :style="{ color: itemL2.trench.color }"
                        class="fas fa-square float-right"
                      ></i>
                    </span>

                    <span v-else>
                      {{ keyL2 }}
                      <i
                        aria-hidden="true"
                        :style="{ color: Object.values(itemL2)[0].color }"
                        class="fas fa-square float-right"
                      ></i>
                    </span>

                    <!-- <span
                      ><i :class="`fas fa-caret-down`" aria-hidden="true"></i
                    ></span> -->
                  </div>

                  <div
                    v-if="keyL2 === 'Complete' || keyL2 === 'Incomplete'"
                  ></div>
                  <div v-else>
                    <b-collapse
                      v-if="Object.keys(itemL2).length > 1"
                      :id="`${indexL1}${indexL2}L2`"
                      class="mt-2"
                    >
                      <div
                        class="subItem2"
                        v-for="(itemL3, keyL3, indexL3) in itemL2"
                        :key="`${keyL3}-${indexL3}`"
                        :class="{
                          clickedHighlighter:
                            clickedSummary === currentDate + keyL2 + keyL3,
                        }"
                        @click="renderDetails(keyL2, keyL3, itemL3)"
                      >
                        <span>
                          {{ keyL3 }}
                        </span>
                      </div>
                    </b-collapse>
                  </div>
                </div>
              </b-collapse>
            </div>
          </transition>
        </b-list-group-item>
      </b-list-group>
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
            <!-- <div class="clickedItemHeader">{{ clickedDetails.sub_class }}</div> -->
            <b-list-group-item>
              Actual : {{ clickedDetails.actual }}
            </b-list-group-item>
            <b-list-group-item>
              Total : {{ clickedDetails.total }}
            </b-list-group-item>
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
  props: ["summaryData"],
  data() {
    return {
      clickedDetailsVisible: false,
      clickedDetails: {},
      clickedSummary: null,
    };
  },
  computed: {
    currentDate: function () {
      let currentDate = this.$store.state.airmapStore.currentDate;
      return currentDate ? currentDate : "";
    },
    kmlBaseUrl: function () {
      let kmlBaseUrl = this.$store.state.projectStore.projectProperties.kml;
      return kmlBaseUrl ? kmlBaseUrl : "";
    },
  },
  methods: {
    lightning() {
      console.log("sdfliahiuho");
    },
    componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    },
    rgbToHex(r, g, b) {
      return (
        "#" +
        this.componentToHex(r) +
        this.componentToHex(g) +
        this.componentToHex(b)
      );
    },
    renderDetails(keyL2, keyL3, value) {
      this.clickedSummary = this.currentDate + keyL2 + keyL3;
      this.clickedDetails = value;
      this.clickedDetailsVisible = true;
      // console.log("dsaffafa", value);
      const rgb = value.color
        .substring(4, value.color.length - 1)
        .replace(/ /g, "")
        .split(",");
      const r = parseInt(rgb[0]);
      const g = parseInt(rgb[1]);
      const b = parseInt(rgb[2]);
      let hex_color = this.rgbToHex(r, g, b);

      // console.log(this.kmlBaseUrl);

      //TODO change this url for solar
      if (value) {
        this.$root.$emit("kmlClicked", {
          url: `${this.kmlBaseUrl}` + "summary/" + `${value.kml[0]}`,
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
    downloadSummary() {
      this.$store.dispatch("airmapStore/downloadCompileApi", "downloadsummary");
    },
   
  },
   destroyed() {
      this.$root.$emit("removeKml");
    },
};
</script>

<style scoped>
.summaryListContainer {
  /* max-width: 100px; */
  max-height: 75vh;
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
.sideBarDetailsContainer {
  position: absolute;
  left: 370px;
  bottom: 100px;
  min-width: 200px;
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
  text-transform: capitalize;
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
