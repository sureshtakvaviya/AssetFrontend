<template>
  <div class="comparePage">
   
    <compareMaps/>
  </div>
</template>

<script>
// @ is an alias to /src
import store from "@/store";
import router from "@/router"
import compareMaps from '@/components/modules/airmap/compareMaps/compareMaps.vue'

export default {
  name: 'comparePage',
  components: {
    compareMaps
  },
  beforeRouteEnter(to, from, next) {

    if (to.params.projectId) {
      store
        .dispatch("projectStore/fetchProjectByIdApi", {projectId:+to.params.projectId,page:"compare"})
        .then((response) => {
          if (response === "success") {

            next();
          }
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
         router.push("/home");
        });
    } else {
       router.push("/home");
    }
  },
  // when route changes and this component is already rendered,
  // the logic will be slightly different.
  beforeRouteUpdate(to, from, next) {
    if (to.params.projectId) {
      store
        .dispatch("projectStore/fetchProjectByIdApi", +to.params.projectId)
        .then((response) => {
          if (response === "success") {
            
            next();
          }
        })
        .catch((error) =>{
          console.log(JSON.stringify(error));
          router.push("/home");
        });
    } else {
      router.push("/home");
    }

  },
}
</script>

<style scoped>
.comparePage{
  height: 100%;
}
</style>