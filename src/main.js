import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Icon } from 'leaflet';

import { BootstrapVue,IconsPlugin } from "bootstrap-vue";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'leaflet/dist/leaflet.css';
import VueApexCharts from 'vue-apexcharts'


import LoadScript from 'vue-plugin-load-script';


import dayjs from 'dayjs';
// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.use(LoadScript);

Vue.component('apexchart', VueApexCharts)

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Form Validations
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

//Casl
import {abilitiesPlugin} from '@casl/vue'
Vue.use(abilitiesPlugin, store.getters.ability);

//importing theme toggle switch
import VueToggles from 'vue-toggles';
Vue.component('VueToggles', VueToggles);

Vue.filter('dateFormat', function (date,format) {
  if (!date) return ''
  date = date.toString()
  return dayjs(date).format(format)
})
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
Vue.filter('fileSizer', function (bytes, decimals =2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
