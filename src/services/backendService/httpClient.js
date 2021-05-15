import axios from 'axios';
import Vue from 'vue'
import { TokenService } from "@/services/tokenService/tokenService.js";

//import { apiBaseUrl } from '@/environment/environment';

/**
 * Axios basic configuration
 * Some general configuration can be added like timeout, headers, params etc. More details can be found on https://github.com/axios/axios
 * */
const config = {
  baseURL: 'http://takvaviya.in:8001/Asset/'
};

/**
 * Creating the instance of Axios
 * It is because, in large scale application we may need to consume APIs from more than single server,
 * So, may need to create multiple http client with different config
 * Only this client will be used rather than axios in the application
 **/
const httpClient = axios.create(config);

/**
 * Auth interceptors
 * @description Configuration related to AUTH token can be done in interceptors.
 * Currenlty it is just doing nothing but idea to to show the capability of axios and its interceptors
 * In future, interceptors can be created into separate files and consumed into multiple http clients
 * @param {*} config
 */
const authInterceptor = config => {
  config.headers["Authorization"] = `Token ${TokenService.getToken()}`
  return config;
};

const loggerInterceptor = config => {
  /** Add logging here */
  return config;
};

/** Adding the request interceptors */
httpClient.interceptors.request.use(authInterceptor);
httpClient.interceptors.request.use(loggerInterceptor);

/** Adding the response interceptors */
httpClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    /** Do something with response error */
    let vm = new Vue()
    console.log(error.message);
    vm.$bvToast.toast(`${error.message}`, {
        title: "Communication Error",
        autoHideDelay: 2000,
        appendToast: false,
        variant: "danger",
      });
    return Promise.reject(error);
  }
);

export { httpClient };
