

<template>
  <div class="centerContainer">
    <div class="timelineContainer d-flex w-100 justify-content-end">
      <div class="flex-grow-1 text-center">
        <b-button pill variant="dark" class="border-0">{{
          currentDate
        }}</b-button>
      </div>
      <!-- <div class="timeLineToggler">
        <b-button
          v-if="!isPaginatorShowing"
          class="shadow primaryBg border-0"
          pill
          variant="secondary"
          @click="toggleTimeline"
          v-b-tooltip.hover.right
          title="Show timeline"
          ><i class="icon fa fa-calendar-alt" aria-hidden="true"></i
        ></b-button>
        <b-button
          v-else
          id="timeLineCloser"
          class="shadow"
          pill
          variant="outline-danger"
          @click="toggleTimeline"
          v-b-tooltip.hover.right
          title="Hide timeline"
          ><i class="icon fa fa-times" aria-hidden="true"></i
        ></b-button>
      </div>
      <transition name="fade">
        <div class="timelinePaginator" v-show="isPaginatorShowing">
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            class="mt-4"
            page-class="date-link"
            first-number
            last-number
            align="fill"
            @change="switchDate"
          >
            <template #prev-text
              ><span><i class="fas fa-angle-left"></i></span
            ></template>
            <template #next-text
              ><span><i class="fas fa-angle-right"></i></span
            ></template>
            <template v-slot:page="{ page, active }">
              <div class="h-100 d-flex flex-column justify-content-around">
                <div class="d-flex align-items-center justify-content-center">
                  <div class="w-100 diamondContainer">
                    <i
                      class="diamond fas fa-square"
                      :class="{
                        active: active === true,
                      }"
                    ></i>
                  </div>
                </div>
                <b v-if="active">{{ datesArray[page - 1] }}</b>
                <i v-else>{{ datesArray[page - 1] }}</i>
              </div>
            </template>
          </b-pagination>
        </div>
      </transition> -->

      <!-- <b-dropdown text="Dates" dropleft variant="dark">
            <b-dropdown-item
              href="#"
              v-for="(date, index) in datesArray"
              :key="index"
              @click="switchDateFromDropDown(date)"
              :class="{
                selectedDate: date === currentDate,
              }"
            >
              <div v-if="type[index].type === 'SCQM+SCPM'" style="color: blue">
                {{ date }} <i style="margin-left:15px" class="fa fa-dot-circle-o"></i>
              </div>
              <div v-if="type[index].type === 'SCQM'" style="color: green">
                {{ date }} <i style="margin-left:15px" class="fa fa-circle-o"></i>
              </div>
              <div v-if="type[index].type === 'SCPM'" style="color: red">
                {{ date }} <i style="margin-left:15px" class="fa fa-circle"></i>
            </div>
            </b-dropdown-item>
          </b-dropdown> -->


        <div class="timelineDropdown" v-if="site_type === 'Construction_Site'">
                                      <!-- solar site Drop down  start-->

          <b-dropdown text="Dates" dropleft variant="dark">
            <b-dropdown-item
              
              href="#"
              v-for="(date, index) in datesArray"
              :key="index"
              @click="switchDateFromDropDown(date)"
              :class="{
                selectedDate: date === currentDate,
              }"
            >
              {{ date }}
            </b-dropdown-item>
          </b-dropdown>
                                      <!-- solar site Drop down  end-->
        
      </div>
      <div  v-if="site_type === 'Solar_Site'" >
        <div id="app">
          <b-dropdown id="dropdown-1" right text="Date" class="m-md-2 ">
            <b-dropdown-item
            
              v-for="(item, index) in menu"
              :key="index"
              @mouseover.native="toogleItem(index)"
              @mouseout.native="toogleItem(index)"
            >
              <span
                >{{ item.title }}
                <b-icon-caret-down-fill
                  :scale="0.6"
                  v-if="item.children"
                ></b-icon-caret-down-fill
              ></span>
              <div style="max-height: 15vh;overflow: auto;"
                v-if="item.children"
                class="sub-menu"
                v-show="item.showSubMenu"
              >
                <b-dropdown-item
                  v-for="(item, index) in item.children"
                  :key="index"
                  @click="switchDateFromDropDown(item.title)"
                  :class="{
                    selectedDate: item.title === currentDate,
                  }"
                  >{{ item.title }}
                </b-dropdown-item>
              </div>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
//TODO remove commented version of timeline after confirmation


export default {
  name: "timeline",
  // components: { Dropdown },
  data() {
    var scpm = [];
var scqm = [];
var qmpm = [];
    for (var m in this.$store.state.projectStore.datesArray) {

      if (this.$store.state.projectStore.datesArray[m].type === "SCPM") {
        scpm.push({ title: this.$store.state.projectStore.datesArray[m].date });
      }
      if (this.$store.state.projectStore.datesArray[m].type === "SCQM") {
          
        scqm.push({ title: this.$store.state.projectStore.datesArray[m].date });
      }
      if (this.$store.state.projectStore.datesArray[m].type === "SCQM+SCPM") {
        qmpm.push({ title: this.$store.state.projectStore.datesArray[m].date });
      }
    }
    // if(scpm.length === 0){
    //   scpm.push({title:"No Projects"})
    // }
    // if(scqm.length === 0){
    //   scqm.push({title:"No Projects"})
    // }
    // if(qmpm.length === 0){
    //   scpm.push({title:"No Projects"})
    // }

    return {
      perPage: 1,
      currentPage: 1,
      sample: 40,
      type: this.$store.state.projectStore.datesArray,
      site_type: this.$store.state.projectStore.projectType,
      menu: [
        {
          title: "SCPM",
          showSubMenu: false,
          children: scpm,
        },
        {
          title: "SCQM",
          showSubMenu: false,
          children: scqm,
        },
        {
          title: "SCPM+SCQM",
          showSubMenu: false,
          children: qmpm,
        },
      ],
    };
  },

  computed: {
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
        console.log(this.$store.state.projectStore.datesArray);
      }

      return dates_array;
    },
    rows: function () {
      return this.datesArray.length ? this.datesArray.length : 0;
    },
    currentDate: function () {
      let currentDate = this.$store.state.airmapStore.currentDate;
      return currentDate ? currentDate : "";
    },
  },
  methods: {
    toogleItem(index) {
      if (this.menu[index].children) {
        if (!this.menu[index].showSubMenu) {
          this.menu[index].showSubMenu = true;
        } else {
          this.menu[index].showSubMenu = false;
        }
      }
    },
    switchDate(event) {
      let selectedDate = this.datesArray[event - 1];
      this.$store.dispatch("projectStore/switchProjectbyDate", selectedDate);
    },
    switchDateFromDropDown(date) {
      if (date) {
        this.$store.dispatch("projectStore/switchProjectbyDate", date);

        //Since paginator and the dropdown are independent one won't change based on other's changes
        //therefore explicitly setting current page of the paginator from dropdown
        let selectedDateIndex = this.datesArray.indexOf(date);
        this.currentPage = selectedDateIndex + 1;
      }
    },
    // toggleTimeline() {
    //   this.isPaginatorShowing = !this.isPaginatorShowing;
    // },
  },

  
};
</script>


<style scoped>
#app {
  height: 0% !important;
}

.sub-menu {
  position: absolute;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: -1.99rem -177px 0px;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
}

.centerContainer {
  display: flex;
  justify-content: center;
}
.timeLineToggler {
  text-align: center;
}
.timeLineToggler #timeLineCloser.btn {
  background-color: #ffffff8a;
}
.timeLineToggler #timeLineCloser.btn:hover {
  background-color: var(--danger);
}
.timelineContainer {
  position: absolute;
  top: 50px;
  margin: auto;
  z-index: 999;
  display: block;
}
.timelinePaginator {
  display: flex;
  justify-content: center;
}
.centerContainer {
  justify-content: flex-end;
}
.timelineDropdown {
  display: block;
}
li.page-item,
button.page-link {
  height: 2rem !important;
}
.diamond {
  transform: rotate(45deg);
  font-size: 1.1rem;
}
.diamond.active {
  color: var(--primaryBg);
  z-index: 9999999;
}
.diamondContainer {
  position: relative;
  z-index: 999;
  margin-top: 1rem;
}
.diamondContainer:after {
  content: "";
  position: absolute;
  width: 125%;
  height: 0.5rem;
  background-color: var(--dark);
  top: 23%;
  left: 50%;
  z-index: 10;
  transition: all ease-in-out 0.3s;
}

.timeline li.active-tl {
  color: #555555;
}
.timeline li.active-tl:before {
  background: #4caf50;
  color: #f1f1f1;
}

.timeline li.active-tl + li:after {
  background: #4caf50;
}

.timelineDropdown >>> .dropdown-menu.show {
  display: block;
  max-height: 25vh;
  overflow: auto;
}
/* #text_color{
  color: var(--blue);
} */
@media only screen and (max-width: 1026px) {
  .timelinePaginator {
    display: none;
  }
  .timeLineToggler {
    display: none;
  }
  /* .timelineDropdown {
    display: block;
  } */
  .centerContainer {
    justify-content: flex-end;
  }

  .selectedDate {
    background-color: var(--primaryBg);
    color: var(--light) !important;
  }
  .selectedDate a:hover {
    color: var(--dark) !important;
  }
}
</style>
