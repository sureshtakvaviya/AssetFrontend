<template>
  <div>
    <!-- <div id="statusTableContainer">
      <b-table
        :caption-top="true"
        :items="projectStatus"
        :fields="fields"
        :per-page="perPage"
        :current-page="currentPage"
        responsive="sm"
      >
        <template #head(status)="data">
          <div class="text-center">{{ data.label }}</div>
        </template>
        <template #cell(date)="data">
          <div class="h-100 d-flex align-items-center">
            {{ data.value }}
          </div>
        </template>
        <template #cell(status)="data">
          <div>
            <section class="step-indicator d-flex align-items-center mb-3">
              <div
                class="step step1"
                :class="{
                  active: data.item.statusNumber >= 1,
                }"
              >
                <div class="step-icon">
                  <i class="fas fa-cloud-upload-alt"></i>
                </div>
                <p>Uploaded</p>
              </div>
              <div
                class="indicator-line"
                :class="{
                  active: data.item.statusNumber >= 1,
                }"
              ></div>
              <div
                class="step step2"
                :class="{
                  active: data.item.statusNumber >= 2,
                }"
              >
                <div class="step-icon">
                  <i class="fas fa-drafting-compass"></i>
                </div>
                <p>Orthomosaic</p>
              </div>
              <div
                class="indicator-line"
                :class="{
                  active: data.item.statusNumber >= 2,
                }"
              ></div>
              <div
                class="step step3"
                :class="{
                  active: data.item.statusNumber >= 3,
                }"
              >
                <div class="step-icon"><i class="fas fa-check-circle"></i></div>
                <p>Completed</p>
              </div>
            </section>
          </div>
        </template>
      </b-table>
      <b-pagination
        pills
        :total-rows="projectStatus.length"
        v-model="currentPage"
        :per-page="perPage"
        align="center"
        @change="paginate"
      ></b-pagination>
    </div> -->
    <div id="statusContainer">
      <div class="d-flex justify-content-center">
        <b-form-select
        class="w-25"
          id="sector-input"
          v-model="selectedDate"
          @change="dateSelected"
          :options="datesArray"
        ></b-form-select>
      </div>
      <div class="d-flex justify-content-center" v-if="selectedDate">
          <div class="my-3 w-75">
            <section class="step-indicator d-flex align-items-center mb-3">
              <div
                class="step step1"
                :class="{
                  active: this.selectedStatus.statusNumber >= 1,
                }"
              >
                <div class="step-icon">
                  <i class="fas fa-cloud-upload-alt"></i>
                </div>
                <p>Uploaded</p>
              </div>
              <div
                class="indicator-line"
                :class="{
                  active: this.selectedStatus.statusNumber >= 1,
                }"
              ></div>
              <div
                class="step step2"
                :class="{
                  active: this.selectedStatus.statusNumber >= 2,
                }"
              >
                <div class="step-icon">
                  <i class="fas fa-drafting-compass"></i>
                </div>
                <p>Orthomosaic</p>
              </div>
              <div
                class="indicator-line"
                :class="{
                  active: this.selectedStatus.statusNumber >= 2,
                }"
              ></div>
              <div
                class="step step3"
                :class="{
                  active: this.selectedStatus.statusNumber >= 3,
                }"
              >
                <div class="step-icon"><i class="fas fa-check-circle"></i></div>
                <p>Completed</p>
              </div>
            </section>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/valid-v-model */
//TODO remove commented after confirmation
export default {
  name: "statusModal",
  props: { statusArray: { type: Array } }, //TODO change after demo
  data() {
    return {
      fields: ["date", "status"],
      perPage: 5,
      currentPage: 1,
      infoText:
        'Users with <strong>"Write"</strong> access can <strong>create, edit and delete</strong> content while those with <strong>"Read"</strong> can <strong>only view</strong> data.',

      dummyStatus: [
        { date: "21-02-2020", status: "FTP" },
        { date: "22-02-2020", status: "Orthomosaic" },
        { date: "21-02-2020", status: "Complete" },
      ],
      statusMap: new Map([
        ["Incomplete", 0],
        ["FTP", 1],
        ["Orthomosaic", 2],
        ["Complete", 3],
      ]),
      selectedDate: null,
      selectedStatus: null,
    };
  },
  computed: {
    projectStatus: function() {
      let projectStatus = this.statusArray.map((statusData) => ({
        ...statusData,
        statusNumber: this.statusMap.get(statusData.status),
      }));
      return projectStatus ? projectStatus : [];
    },
    datesArray: function() {
      let datesArray = this.statusArray.map((statusData) => {
        return { value: statusData.date, text: statusData.date };
      });
      datesArray.unshift({ value: null, text: "Please select a date" });
      return datesArray;
    },
  },
  methods: {
    paginate(page) {
      this.currentPage = page;
    },
    dateSelected(date) {
      if(date)
      {
        this.selectedStatus = this.statusArray.find(statusData => statusData.date === date);
        this.selectedStatus = {...this.selectedStatus, statusNumber: this.statusMap.get(this.selectedStatus.status)}
        console.log(this.selectedStatus)
      }
    }
  },
};
</script>

<style scoped>
.accessListContainer {
  display: flex;
  flex-direction: column;
}
.accessListItem {
  min-height: 50px;
}
div.modal-content div.tooltip div.tooltip-inner {
  max-width: 20rem;
}
.table td {
  vertical-align: middle !important;
}
.step-indicator {
  padding: 0 40px;
}

.step {
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.step-indicator .step-icon {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background: #c2c2c2;
  font-size: 10px;
  text-align: center;
  color: #ffffff;
  position: relative;
  line-height: 50px;
  font-size: 20px;
}

.step.active .step-icon {
  background: var(--success);
}

.step p {
  text-align: center;
  position: absolute;
  bottom: -40px;
  color: #c2c2c2;
  font-size: 14px;
  font-weight: bold;
}

.step.active p {
  color: var(--dark);
}

.step.step2 p,
.step.step3 p {
  left: 50%;
  transform: translateX(-50%);
}

.indicator-line {
  width: 100%;
  height: 2px;
  background: #c2c2c2;
  flex: 1;
}

.indicator-line.active {
  background: var(--success);
}

@media screen and (max-width: 500px) {
  .step p {
    font-size: 11px;
    bottom: -20px;
  }
}
</style>
