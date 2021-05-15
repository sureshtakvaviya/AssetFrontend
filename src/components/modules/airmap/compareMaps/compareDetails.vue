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
        {{ totalAssets }} Assets
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
              :total-rows="totalAssets"
              v-model="currentPage"
              :per-page="perPage"
              align="right"
              @change="paginate"
            ></b-pagination>
          </b-col>
          <b-col cols="2">
            <b-form-select
              class="w-50"
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
        align="center"
        @change="paginate"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "compareDetails",
  data: function () {
    return {
      perPage: 5,
      currentPage: 1,
      perPageOptions: [5, 10, 15],

      perPageTable: 5,
      currentPageTable: 1,
      dummyLeftData: [],
      dummyRightData: [
        76,
        85,
        101,
        98,
        87,
        43,
        24,
        67,
        26,
        47,
        24,
        98,
        23,
        56,
        26,
        84,
        36,
        68,
      ],
      isChart: true,
    };
  },
  computed: {
    ...mapState({
      leftDate: (state) => state.projectStore.compareDataLeft.date,
      rightDate: (state) => state.projectStore.compareDataRight.date,
      summaryLeft: (state) => state.projectStore.compareDataLeft.summary,
      summaryRight: (state) => state.projectStore.compareDataRight.summary,
      count: (state) => {
        return state.projectStore.projectData;
      },
    }),
    totalAssets: function () {
      let assetsNumber = Object.keys(this.summaryLeft).length;
      return assetsNumber ? assetsNumber : 0;
    },
    start: function () {
      let start = (this.currentPage - 1) * this.perPage;
      return start ? start : 0;
    },
    end: function () {
      let end = this.currentPage * this.perPage;
      if (end < this.totalAssets) return end ? end : 0;
      else return this.totalAssets;
    },
    shownAssets: function () {
      let allAssets = Object.keys(this.summaryLeft);
      let shownAssets = {};
      let project_data = this.count;
      console.log(project_data);
      let iterator = project_data.entries();
      let values_left = [];
      let values_right = [];

      for (let e of iterator) {
        if ((e[0] = this.leftDate)) {
          if (e[0] == e[1].date) {
            let newObj = Object.values(e[1].summary);

            for (let ne of newObj) {
              values_left.push(ne.Area_m2);
            }
          }
        }
        if ((e[0] = this.rightDate)) {
          if (e[0] == e[1].date) {
            let newObj = Object.values(e[1].summary);
            for (let ne of newObj) {
              values_right.push(ne.Area_m2);
            }
          }
        }
      }
      shownAssets.names = allAssets.slice(this.start, this.end);
      shownAssets.leftData = values_left.slice(this.start, this.end);
      shownAssets.rightData = values_right.slice(this.start, this.end);
      console.log(values_left);
      console.log(values_right);
      console.log(this.summaryLeft);
      console.log(this.rightDate);
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
          fontSize: "16px",
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
      let tableData = this.$store.getters["projectStore/getCompareDataTable"];
      console.log(tableData);
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
