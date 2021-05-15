<template>
  <div id="app">
    <loading
      loader="bars"
      :active.sync="isSpinnerShowing"
      :can-cancel="true"
      :is-full-page="fullPage"
      background-color="#000"
      color="#4527A0"
    ></loading>
    <router-view />
  </div>
</template>
<script>
// Import component
import Loading from "vue-loading-overlay";
// Import stylesheet
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  components: {
    Loading,
  },
  data() {
    return {
      fullPage: true,
    };
  },
  computed: {
    isSpinnerShowing: function() {
      let isSpinnerShowing = this.$store.state.isSpinnerShowing;
      return isSpinnerShowing ? true : false;
    },
  },
  methods: {
    handleToast({
      message,
      title = "Info",
      time = "3000",
      variant = "success",
    }) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: time,
        appendToast: false,
        variant: variant,
      });
    },
  },
  mounted() {
    this.$root.$on("showToast", (toastData) => {
      if (toastData) {
        this.handleToast(toastData);
      }
    });
  },
};
</script>
<style>
@import url(
  https://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic&subset=latin,cyrillic
);
@import "./assets/css/variables.css";
* {
  margin: 0;
  padding: 0;
  border: 0;
}
html {
  height: 100vh !important;
}
body {
  min-height: 100% !important;
}
#app {
  font-family: "Roboto", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}
.primaryBg {
  background-color: var(--primaryBg) !important;
}
.text-primaryBg {
  color: var(--primaryBg);
}
.transparentBg {
  background-color: var(--transparent-dark) !important;
  opacity: 0.5;
}
.modal-content {
  overflow: hidden;
}
#statusTableContainer .table td {
  vertical-align: middle !important;
}
.b-sidebar:not(.b-sidebar-right) {
  left: 60px !important;
  top: 70px;
  right: auto;
  background: white !important;
  min-width: 220px;
  border-radius: 10px;
  max-width: 270px !important;
}
.title {
  color: var(--light);
}
.leaflet-touch .leaflet-bar a {
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 50% !important;
}
.leaflet-control-toolbar,
.leaflet-bar {
  border: none !important;
}
.leaflet-toolbar-icon {
  border-radius: 50% !important;
}
.leaflet-toolbar-icon:hover {
  background-color: var(--primaryHover) !important;
  color: white !important;
}
.leaflet-sbs-range {
  position: absolute;
  left: 0px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s !important;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.leaflet-control-measure h3,
.leaflet-measure-resultpopup h3 {
  margin: 0 0 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}
.leaflet-control-measure p,
.leaflet-measure-resultpopup p {
  margin: 10px 0 0;
  line-height: 1.5em;
}
.leaflet-control-measure p:first-child,
.leaflet-measure-resultpopup p:first-child {
  margin-top: 0;
}
.leaflet-control-measure .tasks,
.leaflet-measure-resultpopup .tasks {
  margin: 12px 0 0;
  padding: 10px 0 0;
  border-top: 1px solid #ddd;
  text-align: right;
  list-style: none;
  list-style-image: none;
}
.leaflet-control-measure .tasks li,
.leaflet-measure-resultpopup .tasks li {
  display: inline;
  margin: 0 10px 0 0;
}
.leaflet-control-measure .tasks li:last-child,
.leaflet-measure-resultpopup .tasks li:last-child {
  margin-right: 0;
}
.leaflet-control-measure .coorddivider,
.leaflet-measure-resultpopup .coorddivider {
  color: #999;
}
.leaflet-control-measure {
  max-width: 280px;
  background: #fff;
}
.leaflet-control-measure .leaflet-control-measure-toggle,
.leaflet-control-measure .leaflet-control-measure-toggle:hover {
  /*custom changes */
  display: none !important;
  /*custom changes */
  background-size: 14px 14px;
  background-image: url(~leaflet-measure/assets/rulers.png);
  border: 0;
  border-radius: 4px;
  text-indent: 100%;
  white-space: nowrap;
  overflow: hidden;
}
.leaflet-touch .leaflet-control-measure .leaflet-control-measure-toggle,
.leaflet-touch .leaflet-control-measure .leaflet-control-measure-toggle:hover {
  border-radius: 2px;
}
.leaflet-retina .leaflet-control-measure .leaflet-control-measure-toggle,
.leaflet-retina .leaflet-control-measure .leaflet-control-measure-toggle:hover {
  background-image: url(~leaflet-measure/assets/rulers_@2X.png);
}
.leaflet-touch .leaflet-control-measure .leaflet-control-measure-toggle,
.leaflet-touch .leaflet-control-measure .leaflet-control-measure-toggle:hover {
  background-size: 16px 16px;
}
.leaflet-control-measure .startprompt h3 {
  margin-bottom: 10px;
}
.leaflet-control-measure .startprompt .tasks {
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
  text-align: left;
}
.leaflet-control-measure .leaflet-control-measure-interaction {
  /*custom changes */
  display: block !important;
  /*custom changes */
  padding: 10px 12px;
}
.leaflet-control-measure .results .group {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dotted #eaeaea;
}
.leaflet-control-measure .results .group:first-child {
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
}
.leaflet-control-measure .results .heading {
  margin-right: 5px;
  color: #999;
}
.leaflet-control-measure a.start {
  display: inline;
  width: auto;
  height: auto;
  padding-left: 20px;
  margin-right: 4px;
  line-height: 1em;
  border: 0;
  text-align: left;
  background-image: url("~leaflet-measure/assets/start.png");
  background-repeat: no-repeat;
  background-position: 0 50%;
  background-size: 12px 12px;
  color: #5e66cc;
  text-decoration: none;
}
.leaflet-bar a,
.leaflet-bar a:hover {
  display: inline !important;
}
/* .leaflet-control-measure a.start,
.leaflet-control-measure a.start:hover {
  background-color: transparent;
} */
.leaflet-retina .leaflet-control-measure a.start {
  background-image: url("~leaflet-measure/assets/start_@2X.png");
}
/* .leaflet-control-measure a.start:hover {
  opacity: 0.5;
  text-decoration: none;
} */
.leaflet-control-measure a.cancel {
  display: inline;
  width: auto;
  height: auto;
  padding-left: 20px;
  margin-right: 4px;
  line-height: 1em;
  border: 0;
  text-align: left;
  background-image: url("~leaflet-measure/assets/cancel.png");
  background-repeat: no-repeat;
  background-position: 0 50%;
  background-size: 12px 12px;
  color: #5e66cc;
  text-decoration: none;
}
/* .leaflet-control-measure a.cancel,
.leaflet-control-measure a.cancel:hover {
  background-color: transparent;
} */
.leaflet-retina .leaflet-control-measure a.cancel {
  background-image: url("~leaflet-measure/assets/cancel_@2X.png");
}
/* .leaflet-control-measure a.cancel:hover {
  opacity: 0.5;
  text-decoration: none;
} */
.leaflet-control-measure a.finish {
  display: inline;
  width: auto;
  height: auto;
  padding-left: 20px;
  margin-right: 4px;
  line-height: 1em;
  border: 0;
  text-align: left;
  background-image: url("~leaflet-measure/assets/check.png");
  background-repeat: no-repeat;
  background-position: 0 50%;
  background-size: 12px 12px;
  color: #5e66cc;
  text-decoration: none;
}
/* .leaflet-control-measure a.finish,
.leaflet-control-measure a.finish:hover {
  background-color: transparent;
} */
.leaflet-retina .leaflet-control-measure a.finish {
  background-image: url("~leaflet-measure/assets/check_@2X.png");
}
/* .leaflet-control-measure a.finish:hover {
  opacity: 0.5;
  text-decoration: none;
} */
.leaflet-measure-resultpopup a.zoomto {
  display: inline;
  width: auto;
  height: auto;
  padding-left: 20px;
  margin-right: 4px;
  line-height: 1em;
  border: 0;
  text-align: left;
  background-image: url("~leaflet-measure/assets/focus.png");
  background-repeat: no-repeat;
  background-position: 0 50%;
  background-size: 12px 12px;
  color: #5e66cc;
  text-decoration: none;
}
.leaflet-measure-resultpopup a.zoomto,
.leaflet-measure-resultpopup a.zoomto:hover {
  background-color: transparent;
}
.leaflet-retina .leaflet-measure-resultpopup a.zoomto {
  background-image: url("~leaflet-measure/assets/focus_@2X.png");
}
.leaflet-measure-resultpopup a.zoomto:hover {
  opacity: 0.5;
  text-decoration: none;
}
.leaflet-measure-resultpopup a.deletemarkup {
  display: inline;
  width: auto;
  height: auto;
  padding-left: 20px;
  margin-right: 4px;
  line-height: 1em;
  border: 0;
  text-align: left;
  background-image: url("~leaflet-measure/assets/trash.png");
  background-repeat: no-repeat;
  background-position: 0 50%;
  background-size: 12px 12px;
  color: #5e66cc;
  text-decoration: none;
}
.leaflet-measure-resultpopup a.deletemarkup,
.leaflet-measure-resultpopup a.deletemarkup:hover {
  background-color: transparent;
}
.leaflet-retina .leaflet-measure-resultpopup a.deletemarkup {
  background-image: url("~leaflet-measure/assets/trash_@2X.png");
}
.leaflet-measure-resultpopup a.deletemarkup:hover {
  opacity: 0.5;
  text-decoration: none;
}

.customScroll::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #f5f5f5;
  border-radius: 10px;
}

.customScroll::-webkit-scrollbar {
  width: 7px;
  background-color: #f5f5f5;
}

.customScroll::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: var(--grey);
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #f5f5f5;
  border-radius: 10px;
}

::-webkit-scrollbar {
  width: 7px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: var(--grey);
}
</style>
