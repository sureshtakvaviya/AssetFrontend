import { httpClient } from "@/services/backendService/httpClient";
import { TokenService } from "@/services/tokenService/tokenService";

const getInitialState = () => {
  return {
    loggedInUser: {},
    currentUserName: "User",
    isEnterpriseAdmin: false,
    subscription: "",
    subUsers: [],
  };
};
// initial state
const state = getInitialState();

// getters
const getters = {
  getAllSubUsers(state) {
    if (state.subUsers.length > 0) {
      let subUsers = state.subUsers;
      let subUsersTableFormat = subUsers.map((subUser) => {
        return {
          username: subUser.username,
          email: subUser.email,
          id: subUser.id,
          date_created: subUser.date_joined,
          name: {
            first_name: subUser.first_name,
            last_name: subUser.last_name,
          },
          phone: subUser.userprofile.mobile_number,
          profile_picture: subUser.userprofile.profile_picture,
        };
      });
      return subUsersTableFormat;
    } else {
      return [];
    }
  },
  getLoggedInUserDetails: (state) => {
    if (state.loggedInUser.userprofile) {
      let apiData = state.loggedInUser;
      let userData = {
        email: apiData.email,
        firstname: apiData.first_name,
        lastname: apiData.last_name,
        username: apiData.username,
        company: apiData.userprofile.company,
        phone: apiData.userprofile.mobile_number,
        subscription: apiData.userprofile.subscription,
        location: apiData.userprofile.location,
        profile_picture: apiData.userprofile.profile_picture,
      };
      if (userData) return userData;
      else return {};
    }
  },
  getLoggedInUserType(state) {
    let userType = "subuser";
    if (state.loggedInUser) {
      userType = state.loggedInUser.userprofile.user_type;
    }
    return userType;
  },
};
// actions
const actions = {
  login({ dispatch }, userCredentials) {
    return new Promise((resolve, reject) => {
      fetch("http://takvaviya.in:8001/Asset/account/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      })
        .then((response) => response.json())
        .then((loggedInUser) => {
          if (loggedInUser.token) {
            TokenService.saveToken(loggedInUser.token);
            dispatch("fetchUserDetailsApi")
              .then((resonse) => {
                if (resonse === "success") {
                  resolve("success");
                }
              })
              .catch((error) => {
                console.log(error);
                reject("error");
              });
          } else {
            reject("error");
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  register({ state }, newUserData) {
    console.log(state);
    return new Promise((resolve, reject) => {
      fetch("http://takvaviya.in:8001/Asset/account/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.response === "Successfully registered a new User") {
            resolve("success");
          } else {
            reject("error");
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  logout({ commit, dispatch }) {
    dispatch("projectStore/resetModule", null, { root: true });
    dispatch("homeStore/resetModule", null, { root: true });
    dispatch("resetRoot", null, { root: true });
    commit("resetModule");
    TokenService.removeToken();
  },
  resetPassword({ state }, email) {
    console.log(state,email);
    //TODO reset password logic
  },
  fetchUserDetailsApi({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      httpClient
        .get(`user/getuser/`)
        .then((res) => {
          let rawData = res.data;
          if (rawData) {
            if (
              rawData.userprofile.subscription === "Enterprise" &&
              rawData.userprofile.user_type === "Admin"
            ) {
              dispatch("getAllSubUsersApi");
              commit("setEnterpriseAdmin", true);
            }
            commit("setLoggedInUser", rawData);
            resolve("success");
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  editUserProfileApi: ({ dispatch }, userUpdateData) => {
    return new Promise((resolve, reject) => {
      if (userUpdateData) {
        httpClient
          .put(`user/profileupdate/`, userUpdateData)
          .then((res) => {
            if (res.data.response === "success") {
              dispatch("fetchUserDetailsApi");
              resolve("success");
            }
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  },
  changePasswordApi: ({ dispatch }, passwordUpdateData) => {
    return new Promise((resolve, reject) => {
      if (passwordUpdateData) {
        httpClient
          .post(`account/password_change/`, passwordUpdateData)
          .then((res) => {
            if (res.data.response === "success") {
              dispatch("fetchUserDetailsApi");
              resolve("success");
            }
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  },
  searchUserApi({ commit }, searchParam) {
    return new Promise((resolve, reject) => {
      httpClient
        .get(`user/${searchParam}/`)
        .then((res) => {
          let rawData = res.data;
          if (rawData) {
            commit("setUserSearchList", rawData);
            resolve("success");
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  //Getting sub users of current user
  getAllSubUsersApi({ commit, dispatch }) {
    dispatch("toggleSpinner", null, { root: true });
    return new Promise((resolve, reject) => {
      httpClient
        .get(`user/getsubuser/`)
        .then((res) => {
          let rawData = [];
          rawData = res.data;
          if (rawData) {
            dispatch("toggleSpinner", null, { root: true });
            commit("setSubUsers", rawData);
            resolve("success");
          }
        })
        .catch((error) => {
          dispatch("toggleSpinner", null, { root: true });
          console.log(error);
          reject(error);
        });
    });
  },

  createSubUserApi: ({ dispatch }) => {
    return new Promise((resolve, reject) => {
      httpClient
        .post(`project/createprofile/`)
        .then((res) => {
          if (res.data.response === "success") {
            dispatch("getAllSubUsersApi");
            resolve(res);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  editSubUserApi: ({ dispatch }, editSubUserData) => {
    return new Promise((resolve, reject) => {
      if (editSubUserData) {
        httpClient
          .put(`project/update/${editSubUserData.id}/`, editSubUserData)
          .then((res) => {
            if (res.data.response === "success") {
              dispatch("getAllSubUsersApi");
              resolve("success");
            }
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  },
  deleteSubUserApi: ({ dispatch }, subUserId) => {
    return new Promise((resolve, reject) => {
      if (subUserId) {
        httpClient
          .delete(`user/deletesubuser/${subUserId}/`)
          .then((res) => {
            if (res.data.response === "success") {
              dispatch("getAllSubUsersApi");
              resolve("subUserDeleted");
            }
          })
          .catch((error) => {
            reject(error);
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
  setSubUsers(state, subUsers) {
    state.subUsers = subUsers;
  },
  setLoggedInUser(state, userData) {
    state.loggedInUser = userData;
  },
  setEnterpriseAdmin(state, isEnterpriseAdmin) {
    state.isEnterpriseAdmin = isEnterpriseAdmin;
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
