import { httpClient } from '@/services/backendService/httpClient'

const getInitialState = () => {
  return {
    projectsArray: [],
    projectDataFetched: false,

    countriesList: {},
    hasCountriesFetched: false,
    statesList: {},
    hasStatesFetched: false,
    citiesList: {},
    hasCitiesFetched: false,
  }
}

// initial state
const state = getInitialState()

// getters
const getters = {
  getProjectById: (state) => (projectId) => {
    let project = state.projectsArray.find(project => project.id === projectId)
    return project ? project : {}
  },
  getCountriesList: (state) => {
    if (state.countriesList) {
      let countriesObject = state.countriesList;
      let countriesListArray = getDropDownList(countriesObject);
      countriesListArray.unshift({ value: null, text: "Please select an option" })
      return countriesListArray;
    }
  },
  getStatesList: (state) => {
    if (state.statesList) {
      let statesObject = state.statesList;
      let statesListArray = getDropDownList(statesObject);
      statesListArray.unshift({ value: null, text: "Please select an option" })
      return statesListArray;
    }
  },
  getCitiesList: (state) => {
    if (state.citiesList) {
      let citiesObject = state.citiesList;
      let citiesListArray = getDropDownList(citiesObject);
      citiesListArray.unshift({ value: null, text: "Please select an option" })
      return citiesListArray;
    }
  },
}

// actions
const actions = {
  //Project
  fetProjectsArrayApi({ commit, dispatch }) {
    dispatch('toggleSpinner', null, { root: true })
    return new Promise((resolve, reject) => {
      httpClient.get(`project/home/`)
        .then(res => {
          let rawData = []
          rawData = res.data.project
          if (rawData) {
            commit('setProjectsArray', rawData)
            dispatch('toggleSpinner', null, { root: true })
            resolve('success')
          }

        })
        .catch(error => {
          dispatch('toggleSpinner', null, { root: true })
          console.log(error)
          reject(error)
        })
    })

  },
  getCountriesListApi: ({ commit }) => {
    fetch(`http://geodata.solutions/api/api.php?type=getCountries&addClasses=%2Ccountries%2Corder-alpha`)
      .then(response => response.json())
      .then(response => {
        if (response.status === 'success') {
          let countries = response.result
          if (countries) {
            commit('setCountriesList', countries)
          }
        }
      })
  },
  getStatesListApi: ({ commit }, countryId) => {
    fetch(`http://geodata.solutions/api/api.php?type=getStates&countryId=${countryId}&addClasses=states%2Corder-alpha`)
      .then(response => response.json())
      .then(response => {
        if (response.status === 'success') {
          let states = response.result
          if (states) {
            commit('setstatesList', states)
          }
        }
      })
  },
  getCitiesListApi: ({ commit }, locationData) => {
    fetch(`http://geodata.solutions/api/api.php?type=getCities&countryId=${locationData.countryId}&stateId=%22${locationData.stateId}%22&addClasses=cities%2Corder-alpha`)
      .then(response => response.json())
      .then(response => {
        if (response.status === 'success') {
          let cities = response.result
          if (cities) {
            commit('setCitiesList', cities)
          }
        }
      })
  },


  createProjectApi: ({ dispatch }, newProjectData) => {

    return new Promise((resolve, reject) => {
      if (newProjectData) {
        httpClient.post(`project/new/`, newProjectData)
          .then(res => {
            if (res.data.response === 'success') {
              dispatch('fetProjectsArrayApi')
              resolve('success')
            }
          })
          .catch(error => {
            reject(error);
          })
      }
    })
  },
  editProjectApi: ({ dispatch }, editProjectData) => {
    return new Promise((resolve, reject) => {
      if (editProjectData) {
        httpClient.put(`project/update/${editProjectData.id}/`, editProjectData)
          .then(res => {
            if (res.data.response === 'success') {
              dispatch('fetProjectsArrayApi')
              resolve('success')
            }
          })
          .catch(error => {
            reject(error);
          })
      }
    })
  },
  deleteProjectApi: ({ dispatch }, projectId) => {
    return new Promise((resolve, reject) => {
      if (projectId) {
        httpClient.delete(`project/delete/${projectId}/`)
          .then(res => {
            if (res.data.response === 'success') {
              dispatch('fetProjectsArrayApi')
              resolve('projectDeleted')
            }
          })
          .catch(error => {
            reject(error);
          })
      }
    })
  },

  //Sharing project with other members
  provideAccessApi: ({ dispatch }, requestData) => {
    return new Promise((resolve, reject) => {
      if (requestData) {
        httpClient.post(`project/access/${requestData.projectId}/`, requestData.shareData)
          .then(res => {
            let accessChanges = res.data
            let successChanges = accessChanges.filter(accessChange => accessChange.response ==="success")
            if (successChanges.length === accessChanges.length) {
              dispatch('fetProjectsArrayApi')
              resolve('success')
            }
            else{
              reject('error')
            }
          })
          .catch(error => {
            reject(error);
          })
      }
    })
  },
  resetModule: ({ commit }) => {
    commit('resetModule')
  }
}

// mutations
const mutations = {
  setProjectsArray(state, apiData) {
    state.projectsArray = apiData;
    state.projectDataFetched = true;
  },
  setCountriesList(state, countries) {
    state.countriesList = countries;
    state.hasCountriesFetched = true;
  },
  setstatesList(state, states) {
    state.statesList = states;
    state.hasStatesFetched = true;
  },
  setCitiesList(state, cities) {
    state.citiesList = cities;
    state.hasCitiesFetched = true;
  },
  resetModule(state) {
    Object.assign(state, getInitialState())
  }
}

//helper functions
function getDropDownList(object) {
  let dropDownArray = [];
  for (let key in object) {
    dropDownArray.push(
      {
        value: { id: key, name: object[key] },
        text: object[key]
      })
  }

  return dropDownArray
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}