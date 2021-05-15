/* eslint-disable no-unused-vars */
import { httpClient } from "@/services/backendService/httpClient";



const getInitialState = () => {
  return {
    projectData: {},
    currentDateProject: {},
    projectProperties: { ortho: {} },
    datesArray: [],
    projectName: "",
    solar_pro_type: "",
    projectId: null,
    projectType: "",
    projectDataFetched: false,
    accessType: null,
    activityData: [],

    compareDataLeft: { Project_properties: { ortho: {} }, Date: "" },
    compareDataRight: { Project_properties: { ortho: {} }, Date: "" },
  };
};
// initial state
const state = getInitialState();
console.log(state)

// getters
const getters = {
  getSummaryData: (state) => {
    if (state.projectDataFetched) {
      let summaryData = state.currentDateProject.summary['summary'];
      if (summaryData) {
        console.log(summaryData)
        return summaryData;
      }
      else return {};
    }
  },
  getSummaryAssetData: (state) => {
    if (state.projectDataFetched) {
      let summaryData = state.currentDateProject.summary;
      if (summaryData) {
        console.log(summaryData)
        return summaryData;
      }
      else return {};
    }
  },
  getDeviationData: (state) => {
    if (state.projectDataFetched) {
      let deviationdata = state.currentDateProject.deviation;
      if (deviationdata) {

        // console.log(deviationdata['data']['Summary'])
        return deviationdata['data']['Summary'];
      }
      else return {};
    }

  },
  getInverterData: (state) => {
    if (state.projectDataFetched) {
      let inverterData = state.currentDateProject.inverter['Inverter'];

      if (inverterData) {
        console.log(inverterData)
        console.log(Object.values(inverterData))
        return {
          inverters: Object.keys(inverterData),
          invertersData: Object.values(inverterData),
        };
      } else return { inverters: [], invertersData: [] };
    }
  },
  getInverterDivData: (state) => {
    if (state.projectDataFetched) {
      let inverterData = state.currentDateProject.inverter_deviation['data'];

      if (inverterData) {
        console.log(inverterData)
        console.log(Object.values(inverterData))
        return {
          inverters: Object.keys(inverterData),
          invertersData: Object.values(inverterData),
        };
      } else return { inverters: [], invertersData: [] };
    }
  },
  getCompareData: (state) => (date) => {
    if (date) {
      let projectData = state.projectData.get(date);
      let projectProperties = projectData.Project_properties;
      return projectProperties ? projectProperties : {};
    }
  },
  //TODO complete this getter for better modularization
  getCompareDataMap: (state) => (side) => {
    if (side === "left") {
      let leftMapData = state.compareDataLeft.Project_properties.ortho;
      if (leftMapData) return leftMapData;
    } else if (side === "right") {
      let rightMapData = state.compareDataRight.Project_properties.ortho;
      if (rightMapData) return rightMapData;
    } else return { RBG: "", DSM: "" };
  },
  getCompareDataTable(state) {
    let summaryLeft = state.compareDataLeft.summary;
    let summaryRight = state.compareDataRight.summary;
    //let dateLeft = state.compareDataLeft.date
    //let dateRight = state.compareDataRight.date

    let dummyLeftData = [
      44,
      55,
      57,
      56,
      61,
      49,
      89,
      23,
      15,
      65,
      57,
      65,
      36,
      95,
      12,
      67,
      34,
      78,
    ];
    let dummyRightData = [
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
    ];
    let assetsNames = Object.keys(summaryRight);
    summaryRight = dummyRightData;
    summaryLeft = dummyLeftData;
    if (summaryLeft && summaryRight) {
      let tableData = [];
      for (let index = 0; index < assetsNames.length; index++) {
        tableData.push({
          Asset: assetsNames[index],
          "Left Data": summaryLeft[index],
          "Right Data": summaryRight[index],
        });
      }

      return tableData;
    } else {
      return [];
    }
  },
  getActivityData(state) {
    if (state.activityData.length > 0) {
      return state.activityData;
    } else {
      return [];
    }
  },
  getProjectInfo: (state) => {
    if (state.projectDataFetched) {
      let projectInfo = {
        projectName: state.projectName,
        projectType: state.projectType,
      };
      return projectInfo;
    }
  },
};

// actions
const actions = {
  fetchProjectByIdApi({ state, commit, dispatch, rootState }, urlData) {
    return new Promise((resolve, reject) => {
      httpClient
        .get(`project/${urlData.projectId}/`)
        .then((res) => {
          if (res.data.project) {
            let project = res.data.project;
            let accessType = res.data.access;
            if (project) {
              commit("setProjectData", project);
              commit("setAccessType", accessType);

              //setting the center of the map
              dispatch(
                "airmapStore/initMap",
                project.projectdata[0].project_properties.center,
                { root: true }
              );
              if (urlData.page === "map") {

                //setting data for map page
                if (project.sector === "Construction_Site") {
                  dispatch("switchProjectbyDate", state.datesArray[0]);

                }
                else {
                  dispatch("switchProjectbyDate", state.datesArray[0].date);

                }

              } else if (urlData.page === "compare") {
                //setting both right and left side starting date for compare page
                if (project.sector === "Construction_Site") {
                  dispatch("setCompareData", {
                    date: state.datesArray[0],
                    side: "left",
                  });
                  dispatch("setCompareData", {
                    date: state.datesArray[0],
                    side: "right",
                  });
                }
                else {
                  dispatch("setCompareData", {
                    date: state.datesArray[0].date,
                    side: "left",
                  });
                  dispatch("setCompareData", {
                    date: state.datesArray[0].date,
                    side: "right",
                  });

                }
              }

              if (rootState.userStore.isEnterpriseAdmin) {
                dispatch("getAllActivityApi");
              }
              resolve("success");
            }
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  switchProjectbyDate({ commit, state, dispatch }, date) {
    if (state.projectData && state.projectData.has(date)) {
      commit("setCurrentDateProject", state.projectData.get(date));
      dispatch("airmapStore/switchDate", date, { root: true });
    }
  },
  setCompareData({ state, commit }, setData) {
    if (setData.date) {
      let projectData = state.projectData.get(setData.date);
      if (projectData) {
        if (setData.side === "left") {
          commit("setCompareLeftData", projectData);
        } else {
          commit("setCompareRightData", projectData);
        }
      }
    }
  },
  downloadFile({ context }, downloadOptions) {
    let url = downloadOptions.url;
    let filename = downloadOptions.filename;
    if (url) {
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          let url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
        })
        .catch((error) => console.log(error));
    }
  },
  getAllActivityApi({ commit, rootState }) {
    httpClient
      .get(`activity/get/${rootState.projectStore.projectId}/`)
      .then((res) => {
        if (res.data) {
          commit("setAllActivity", res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  createNewActivity: ({ state, dispatch, rootState }, activityData) => {
    return new Promise((resolve, reject) => {
      if (activityData) {
        httpClient
          .post(
            `activity/add/${rootState.projectStore.projectId}/`,
            activityData
          )
          .then((res) => {
            if (res.data.response === "success") {
              dispatch("getAllActivityApi");
              resolve("success");
            }
          })
          .catch((error) => {
            console.log(error);
            reject("error");
          });
      }
    });
  },
  deleteActivity({ state, dispatch }, id) {
    return new Promise((resolve, reject) => {
      if (id) {
        httpClient
          .delete(`activity/delete/${id}/`)
          .then((res) => {
            if (res.data.response === "success") {
              dispatch("getAllActivityApi");
              resolve("activityDeleted");
            }
          })
          .catch((error) => {
            console.log(error);
            reject("error");
          });
      }
    });
  },
  resetModule: ({ commit }) => {
    commit("resetModule");
  },
};

// mutations
const mutations = {
  setProjectData(state, apiData) {
    // convert array into map

    let projectDateMap = new Map();
    apiData.projectdata.forEach((projectdata) => {
      projectDateMap.set(projectdata.date, projectdata);
    });
    state.projectData = projectDateMap;
    state.datesArray = apiData.date.sort();
    state.projectName = apiData.title;
    state.projectId = apiData.id;
    state.projectType = apiData.sector;
    state.projectDataFetched = true;
  },

  setAccessType(state, accessType) {
    state.accessType = accessType;
  },
  setCurrentDateProject(state, currentDateProject) {
    state.currentDateProject = currentDateProject;
    state.projectProperties = currentDateProject.project_properties;


  },
  setCompareLeftData(state, leftData) {
    state.compareDataLeft = leftData;
  },
  setCompareRightData(state, rightData) {
    state.compareDataRight = rightData;
  },
  setAllActivity(state, activityArray) {
    state.activityData = activityArray;
  },
  resetModule(state) {
    Object.assign(state, getInitialState());
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
