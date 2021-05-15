import { httpClient } from '@/services/backendService/httpClient'

// initial state
const state = () => ({
  mapOptions: {
    center: [],
    zoom: 18,
  },
  currentDate: "",

  currentKML: null,
  allCadArray: [],

  allAOIs: [],
  allMeasures: []
})

// getters
const getters = {
  getCenter() {
    return state.center;
  },
  getAllAOIs(state) {
    if (state.allAOIs.length > 0) {
      return state.allAOIs
    }
    else {
      return [];
    }
  },
  getAllMeasures(state) {
    if (state.allMeasures.length > 0) {
      return state.allMeasures
    }
    else {
      return [];
    }
  },
  getCurrentCad(state) {
    return state.currentCad.length > 0 ? state.currentCad : []
  },
  getAllCadAlign(state) {
    return state.allCadArray.length > 0 ? state.allCadArray : []
  },
}
// actions
const actions = {
  initMap({ commit }, mapProps) {
    if (mapProps) {
      commit('setMapProps', mapProps);
    }
  },
  switchDate({ commit, dispatch }, date) {
    if (date) {
      commit('setCurrentDate', date);
      dispatch('getAllAOIApi', date);
      dispatch('getAllMeasureApi', date)
      dispatch('getAllCadApi')
    }
  },

  //Aoi Actions
  getAllAOIApi({ commit, rootState }, date) {
    if (date) {
      httpClient.get(`aoi/getallAOI/${rootState.projectStore.projectId}/${date}/`)
        .then(res => {
          if (res.data) {
            commit('setAllAOI', res.data)
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
  },
  saveAoiApi: ({ state, dispatch, rootState }, AOIData) => {
    return new Promise((resolve, reject) => {
      if (AOIData) {
        httpClient.post(`aoi/save_aoi/${rootState.projectStore.projectId}/${state.currentDate}/`, AOIData)
          .then(res => {
            if (res.data.response === "success") {
              dispatch('getAllAOIApi', state.currentDate)
              resolve('success')
            }
          })
          .catch(error => {
            console.log(error);
            reject('error');
          })
      }
    })
  },
  downloadAoiApi: ({ dispatch }, id) => {
    return new Promise((resolve, reject) => {
      httpClient.get(`aoi/downloadaoi/${id}/`)
        .then(res => {
          if (res.data.response ==='success') {

            let url = res.data.Downloadlocation
            let filename = url.split("/").slice(-1)[0]; 
             filename = filename.replace(/\s/g,'')
            
            dispatch('projectStore/downloadFile', {url,filename}, { root: true })
            resolve('success')
          }
        })
        .catch(error => {
          console.log(error);
          reject('error');
        })
    })
  },
  deleteAOIApi({ state, dispatch }, id) {
    return new Promise((resolve, reject) => {
      if (id) {
        httpClient.delete(`aoi/delete_aoi/${id}/`)
          .then(res => {
            if (res.data.response === "success") {
              dispatch('getAllAOIApi', state.currentDate)
              resolve('aoiDeleted')
            }
          })
          .catch(error => {
            console.log(error);
            reject('error');
          })
      }
    })
  },

  //Measure Actions
  getAllMeasureApi({ commit, rootState }, date) {
    if (date) {
      httpClient.get(`aoi/getallMeasure/${rootState.projectStore.projectId}/${date}/`)
        .then(res => {
          if (res.data) {
            commit('setAllMeasure', res.data)
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
  },
  saveMeasureApi: ({ state, dispatch, rootState }, measureData) => {
    return new Promise((resolve, reject) => {
      if (measureData) {
        httpClient.post(`aoi/save_measure/${rootState.projectStore.projectId}/${state.currentDate}/`, measureData)
          .then(res => {
            if (res.data.response === "success") {
              dispatch('getAllMeasureApi', state.currentDate)
              resolve('success')
            }
          })
          .catch(error => {
            console.log(error);
            reject('error');
          })
      }
    })
  },
  downloadMeasureApi: ({ dispatch }, id) => {
    return new Promise((resolve, reject) => {
      httpClient.get(`aoi/downloadmeasure/${id}/`)
        .then(res => {
          if (res.data.response ==='success') {

            let url = res.data.Downloadlocation //TODO Change to Downloadlocation once BE is changed
            let filename = url.split("/").slice(-1)[0]; 
             filename = filename.replace(/\s/g,'')
            
            dispatch('projectStore/downloadFile', {url,filename}, { root: true })
            resolve('success')
          }
        })
        .catch(error => {
          console.log(error);
          reject('error');
        })
    })
  },
  deleteMeasureApi({ state, dispatch }, id) {
    return new Promise((resolve, reject) => {
      if (id) {
        httpClient.delete(`aoi/delete_measure/${id}/`)
          .then(res => {
            if (res.data.response === "success") {
              dispatch('getAllMeasureApi', state.currentDate)
              resolve('measureDeleted')
            }
          })
          .catch(error => {
            console.log(error);
            reject('error');
          })
      }
    })
  },

  //Cad Actions
  getAllCadApi({ state, commit, rootState }) {
    httpClient.get(`designcheck/getallCAD/${rootState.projectStore.projectId}/${state.currentDate}/`)
      .then(res => {
        if (res.data) {
          commit('setAllCadAlign', res.data)
        }
      })
      .catch(err => {
        console.log(err);
      })
  },
  cadAlignUploadApi({ state, dispatch, rootState }, cadUploadData) {
    return new Promise((resolve, reject) => {
      if (cadUploadData) {
        dispatch('toggleSpinner',null, { root: true })
        httpClient.post(`http://takvaviya.in:8001/Asset/designcheck/upload/${rootState.projectStore.projectId}/${state.currentDate}/${cadUploadData.label}/`, cadUploadData.cadFile, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(res => {
            dispatch('toggleSpinner',null, { root: true })
            if (res.data.status === "success") {
              let uploadedCad = res.data.props;
              if (uploadedCad) {
                dispatch('getAllCadApi')
                resolve(uploadedCad)
              }
            }
          })
          .catch(error => {
            dispatch('toggleSpinner',null, { root: true })
            reject(error)
            console.log(error)
          })
      }
      else {
        reject('error')
      }
    })
  },
  cadAlignAdjustApi: ({ state, dispatch, rootState }, cadAlignData) => {
    return new Promise((resolve, reject) => {
      if (cadAlignData) {
        dispatch('toggleSpinner',null, { root: true })
        httpClient.post(`designcheck/adjust/${rootState.projectStore.projectId}/${state.currentDate}/`, cadAlignData)
          .then(res => {
            if (res.data.status === 'success') {
              dispatch('toggleSpinner',null, { root: true })
              let realignedCad = res.data.props
              resolve(realignedCad)
              dispatch('getAllCadApi')
            }
          })
          .catch(error => {
            dispatch('toggleSpinner',null, { root: true })
            reject(error);
            console.log(error)
          })
      }
      else {
        reject('error')
      }
    })

  },
  revertRealignApi({ state, dispatch }, id) {
    return new Promise((resolve, reject) => {
      if (id) {
        dispatch('toggleSpinner',null, { root: true })
        httpClient.post(`designcheck/revert/${id}/`)
          .then(res => {
            dispatch('toggleSpinner',null, { root: true })
            if (res.data.status === "success") {
              dispatch('getAllCadApi', state.currentDate)
              resolve('success')
            }
          })
          .catch(error => {
            dispatch('toggleSpinner',null, { root: true })
            console.log(error);
            reject('error');
          })
      }
    })
  },
  deleteCadAlignApi({ state, dispatch }, id) {
    return new Promise((resolve, reject) => {
      if (id) {
        httpClient.delete(`designcheck/delete_cad/${id}/`)
          .then(res => {
            if (res.data.status === "success") {
              dispatch('getAllCadApi', state.currentDate)
              resolve('cadDeleted')
            }
          })
          .catch(error => {
            console.log(error);
            reject('error');
          })
      }
    })

  },

  //Download Compilations
  downloadCompileApi: ({ state, dispatch, rootState }, downloadType) => {
    return new Promise((resolve, reject) => {
      httpClient.get(`projectdata/${downloadType}/${rootState.projectStore.projectId}/${state.currentDate}/`)
        .then(res => {
          if (res.data.response ==='success') {

            let url = res.data.Downloadlocation
            let filename = url.split("/").slice(-1)[0]; 
             filename = filename.replace(/\s/g,'')
            
            dispatch('projectStore/downloadFile', {url,filename}, { root: true })
            resolve('success')
          }
        })
        .catch(error => {
          console.log(error);
          reject('error');
        })
    })
  },
  downloadCompareApi: ({dispatch, rootState }, date) => {
    return new Promise((resolve, reject) => {
      httpClient.get(`projectdata/downloadsummary/${rootState.projectStore.projectId}/${date}/`)
        .then(res => {
          if (res.data.response ==='success') {

            let url = res.data.Downloadlocation
            let filename = url.split("/").slice(-1)[0]; 
             filename = filename.replace(/\s/g,'')
             filename = `${date}_${filename}`
             console.log(`${date}_${filename}`)
            
            dispatch('projectStore/downloadFile', {url,filename}, { root: true })
            resolve('success')
          }
        })
        .catch(error => {
          console.log(error);
          reject('error');
        })
    })
  },
}

// mutations
const mutations = {
  setMapProps(state, mapProps) {
    state.mapOptions.center = [mapProps.lat, mapProps.lng]
  },
  setCurrentDate(state, currentDate) {
    state.currentDate = currentDate;
  },
  changeOptions(state, options) {
    state.mapOptions.center = options.center,
      state.mapOptions.zoom = options.zoom
  },
  setCurrentKml(state, kmlFile) {
    console.log(state, kmlFile)
    state.currentKML = kmlFile
  },
  setAllCadAlign(state, allCadArray) {
    state.allCadArray = allCadArray
  },
  setAllAOI(state, AOIarray) {
    state.allAOIs = AOIarray;
  },
  setAllMeasure(state, measureArray) {
    state.allMeasures = measureArray;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}