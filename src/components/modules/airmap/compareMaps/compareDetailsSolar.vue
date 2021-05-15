<template>
  <div class="compareDetailsContainer">
    <div class="d-flex justify-content-end mr-3 my-1">
      <VueToggles
        @click="isChart = !isChart"
        :value="isChart"
        height="25"
        width="80"
        checkedText="Chart"
        uncheckedText="Table"
        checkedBg="#007bff"
        uncheckedBg="#007bff"
        fontSize="20px"
        fontWeight="500"
      />
    </div>
    <div v-if="isChart">
      <h5 class="text-center">
        Showing {{ this.start !== 0 ? this.start : 1 }} - {{ this.end }} of
        {{ numberOfAssets }} Assets
      </h5>
      <div class="chartContainer mx-auto">
        <apexchart
          width="100%"
          type="bar"
          :options="options"
          :series="series"
        ></apexchart>
      </div>
      <div>
        <b-row>
          <b-col cols="8">
            <b-pagination
              pills
              :total-rows="numberOfAssets"
              v-model="currentPage"
              :per-page="perPage"
              align="right"
              @change="paginate"
            ></b-pagination>
          </b-col>
          <b-col cols="2">
            <b-form-select
              v-model="perPage"
              :options="perPageOptions"
            ></b-form-select>
          </b-col>
        </b-row>
      </div>
    </div>
    <div v-else class="details">
      <b-table
        id="contact-table"
        :items="tableData"
        :fields="fields"
        :per-page="perPageTable"
        :current-page="currentPageTable"
      ></b-table>
      <b-pagination
        pills
        :total-rows="tableData.length"
        v-model="currentPageTable"
        :per-page="perPageTable"
        align="right"
        @change="paginate"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "compareDetailsSolar",
  data: function () {
    return {
      perPage: 3,
      currentPage: 1,
      perPageOptions: [4, 6, 9, 12],

      perPageTable: 5,
      currentPageTable: 1,
      isChart: true,
    };
  },
  computed: {
    ...mapState({
      project_name: (state) => state.projectStore.solar_pro_type,
      leftDate: (state) => state.projectStore.compareDataLeft.date,
      rightDate: (state) => state.projectStore.compareDataRight.date,
      summaryLeft: (state) => state.projectStore.compareDataLeft.summary,
      summaryRight: (state) => state.projectStore.compareDataRight.summary,
      deviationLeft: (state) =>
        state.projectStore.compareDataLeft.deviation.data.Summary,
      deviationRight: (state) =>
        state.projectStore.compareDataRight.deviation.data.Summary,
    }),
    //The transformation is necessitated because the required data is found nested deep within the json
    //It calls a function to flatten out the nested data and transform it to suit visual data needs
    summaryLeftTransformed: function () {
      let transformedArray = [];
      if (this.project_name == "SCPM") {
        /*  let summary_left = this.$store.state.projectStore.compareDataLeft
          .summary; */
        transformedArray = this.objectToArray(this.summaryLeft);
      } else if (this.project_name == "SCQM") {
        /* let deviation_left = this.$store.state.projectStore.compareDataLeft
          .deviation.data.Summary; */
        transformedArray = this.objectToArraySCQM(this.deviationLeft);
      }
      return transformedArray ? transformedArray : [];
    },
    /* devaitionLeftTransformed: function () {
      let transformedDevArray = this.objectToArraySCQM(this.deviationLeft);
      return transformedDevArray ? transformedDevArray : [];
    }, */
    summaryLeftData: function () {
      let currentValueArray = this.summaryLeftTransformed.map(
        (asset) => asset.current_value
      );
      return currentValueArray ? currentValueArray : [];
    },
    /* deviationLeftData: function () {
      let currentDevValueArray = this.devaitionLeftTransformed.map(
        (asset) => asset.current_value
      );
      return currentDevValueArray ? currentDevValueArray : [];
    }, */

    summaryRightTransformed: function () {
      let transformedArray = [];
      if (this.project_name == "SCPM") {
        /*  let summary_right = this.$store.state.projectStore.compareDataRight
          .summary; */
        transformedArray = this.objectToArray(this.summaryRight);
      } else if (this.project_name == "SCQM") {
        /*  let deviation_right = this.$store.state.projectStore.compareDataRight
          .deviation.data.Summary; */
        transformedArray = this.objectToArraySCQM(this.deviationRight);
      }
      return transformedArray ? transformedArray : [];
    },
    /* devaitionRightTransformed: function () {
      let transformedDevArray = this.objectToArraySCQM(this.deviationRight);
      return transformedDevArray ? transformedDevArray : [];
    }, */
    summaryRightData: function () {
      let currentDevValueArray = this.summaryRightTransformed.map(
        (asset) => asset.current_value
      );
      return currentDevValueArray ? currentDevValueArray : [];
    },
    /* deviationRightData: function () {
      let currentValueArray = this.devaitionRightTransformed.map(
        (asset) => asset.current_value
      );
      return currentValueArray ? currentValueArray : [];
    }, */
    numberOfAssets: function () {
      let assetsNumber = Object.keys(this.summaryRightTransformed).length;
      return assetsNumber ? assetsNumber : 0;
    },
    start: function () {
      let start = (this.currentPage - 1) * this.perPage;
      return start ? start : 0;
    },
    end: function () {
      let end = this.currentPage * this.perPage;
      if (end < this.numberOfAssets) return end ? end : 0;
      else return this.numberOfAssets;
    },
    shownAssets: function () {
      let shownAssets = {};
      let allAssets = this.summaryRightTransformed.map(
        (asset) => asset.assetName
      );
      /*  console.log(this.summaryLeft); */
      console.log(this.project_name);
      shownAssets.names = allAssets.slice(this.start, this.end);
      shownAssets.leftData = this.summaryLeftData.slice(this.start, this.end);
      shownAssets.rightData = this.summaryRightData.slice(this.start, this.end);
      return shownAssets;
    },

    options: function () {
      return {
        chart: {
          id: "vuechart-compare",
        },
        xaxis: {
          categories: this.shownAssets.names,
          labels: {
            style: {
              fontSize: "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label",
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            dataLabels: {
              position: "bottom",
            },
          },
        },
        legend: {
          fontSize: "20px",
          fontFamily: "Helvetica, Arial",
          fontWeight: 400,
          itemMargin: {
            horizontal: 10,
            vertical: 5,
          },
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: undefined,
          textAnchor: "middle",
          distributed: false,
          offsetX: 0,
          offsetY: 0,
          style: {
            fontSize: "14px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "bold",
            colors: ["#fff"],
          },
          background: {
            enabled: true,
            foreColor: "#000",
            padding: 4,
            borderRadius: 2,
            borderWidth: 1,
            borderColor: "#fff",
            opacity: 0.9,
            dropShadow: {
              enabled: false,
              top: 1,
              left: 1,
              blur: 1,
              color: "#000",
              opacity: 0.45,
            },
          },
          dropShadow: {
            enabled: false,
            top: 1,
            left: 1,
            blur: 1,
            color: "#000",
            opacity: 0.45,
          },
        },
        responsive: [
          {
            breakpoint: 995,
            xaxis: {
              labels: {
                style: {
                  fontSize: "10px",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: 400,
                  cssClass: "apexcharts-xaxis-label",
                },
              },
            },
            yaxis: {
              labels: {
                style: {
                  fontSize: "10px",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: 400,
                  cssClass: "apexcharts-yaxis-label",
                },
              },
            },
            options: {
              plotOptions: {
                bar: {
                  horizontal: true,
                },
              },
              legend: {
                position: "right",
                verticalAlign: "top",
                fontSize: "14px",
                fontWeight: 500,
                itemMargin: {
                  horizontal: 10,
                  vertical: 5,
                },
              },
              dataLabels: {
                enabled: false,
              },
            },
          },
        ],
      };
    },
    series: function () {
      return [
        {
          name: `${this.leftDate}`,
          data: this.shownAssets.leftData,
        },
        {
          name: `${this.rightDate}`,
          data: this.shownAssets.rightData,
        },
      ];
    },
    //Table data
    tableData: function () {
      let tableData = [];
      let numberOfAssets = this.numberOfAssets;
      let allAssets = this.summaryRightTransformed.map(
        (asset) => asset.assetName
      );
      for (let i = 0; i < numberOfAssets; i++) {
        tableData.push({
          Asset: allAssets[i],
          "Left Data": this.summaryLeftData[i] ? this.summaryLeftData[i] : "-",
          "Right Data": this.summaryRightData[i]
            ? this.summaryRightData[i]
            : "-",
        });
      }

      if (tableData) return tableData;
      else return [];
    },
    fields: function () {
      let objectKeys = Object.keys(this.tableData[0] ? this.tableData[0] : {});
      let fieldData = objectKeys.map((key) => {
        return { key: key, sortable: true };
      });
      fieldData = [
        { key: "Asset", label: "Asset", sortable: true },
        { key: "Left Data", label: this.leftDate, sortable: true },
        { key: "Right Data", label: this.rightDate, sortable: true },
      ];
      if (fieldData) {
        return fieldData;
      } else return [];
    },
  },
  methods: {
    paginate(page) {
      this.currentPage = page;
      this.objectToArray(this.summaryLeft);
    },

    //Extracts nested objects and transform it to suit the front end requirements
    objectToArraySCQM(obj) {
      let requiredArray = [];
      for (let prop in obj) {
        let innerObj = obj[prop];
        requiredArray.push({
          assetName: `${prop} `,
          current_value: innerObj.actual,
        });
      }
      console.log(requiredArray);
      return requiredArray;

      /* let requiredArray = [];
        for (let prop in obj) {
          let innerObj = obj[prop];
          requiredArray.push({
            assetName: `${prop} `,
            current_value: innerObj.actual,
          });
        }
        console.log(requiredArray);
        return requiredArray; */
    },
    objectToArray(obj) {
      if (this.project_name == "SCPM") {
        let requiredArray = [];
        for (const propL1 in obj) {
          for (const propL2 in obj[propL1]) {
            for (const propL3 in obj[propL1][propL2]) {
              let innerMostObject = obj[propL1][propL2][propL3];
              if (propL2 == "Lightning Arresters") {
                console.log(propL3);
                if (propL3 == "Complete") {
                  requiredArray.push({
                    assetName: `${propL2}`,
                    current_value: innerMostObject.actual,
                  });
                }
              }
              for (const propL4 in obj[propL1][propL2][propL3]) {
                let anotherObj = obj[propL1][propL2][propL3][propL4];
                if (propL2 !== "Lightning Arresters") {
                  if (propL4 == "Complete") {
                    requiredArray.push({
                      assetName: `${propL3} `,
                      current_value: anotherObj.actual,
                    });
                  }
                }
              }
            }
          }
        }
        return requiredArray;
      }
    },
  },
};
</script>

<style scoped>
.compareDetailsContainer {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.chartContainer {
  width: 75%;
}
@media only screen and (max-width: 995px) {
  .chartContainer {
    width: 100%;
  }
}
</style>
