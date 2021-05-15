<template>
  <div>
    <b-form @submit.prevent="onSubmit">
      <b-card class="mt-3" header="The Selected Points are">
        <b-table-simple fixed>
          <colgroup>
            <col style="width:100px" />
          </colgroup>
          <b-thead head-variant="dark">
            <b-th>Pair</b-th>
            <b-th>Latitude</b-th>
            <b-th>Longitude</b-th>
          </b-thead>
          <b-tbody>
            <b-tr v-for="(pair, index) in cadAlign.alignPoints" :key="index">
              <b-td v-if="index % 2 === 0" rowspan="2"
                >Pair {{ index / 2 + 1 }}</b-td
              >
              <b-td>{{ pair.lat.toFixed(4) }}</b-td>
              <b-td>{{ pair.lng.toFixed(4) }}</b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
        <b-button class="primaryBg border-0 float-right" type="submit"
          >Submit</b-button
        >
      </b-card>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "cadAlignModal",
  data() {
    return {
      cadAlign: this.cadAlignProp,
    };
  },
  props: {
    cadAlignProp: Object,
  },
  methods: {
    onSubmit() {
      let a1 = [];
      let b1 = [];
      let cadAlignPointsArray = this.cadAlign.alignPoints;
      for (let i = 0; i < cadAlignPointsArray.length; i++) {
        let lnglat = [cadAlignPointsArray[i].lng, cadAlignPointsArray[i].lat];
        if (i % 2 == 0) {
          a1.push(lnglat);
        } else {
          b1.push(lnglat);
        }
      }
      let cadAlignRequestBody = {
        id: this.cadAlign.id,
        pointA: a1,
        pointB: b1,
      };
      this.$store
        .dispatch("airmapStore/cadAlignAdjustApi", cadAlignRequestBody)
        .then((response) => {
          if (response.cad.length > 0) {
            //converting the response into an object compatiple with the cad rendering function
            let reAlignedCad = {
              id: response.id,
              realign_cad_kml: response.cad,
              uploaded_by: response.uploaded_by,
              creation_date: response.uploaded_date,
              realigned_by: response.realigned_by,
              realign_date: response.realign_date,
            };
            this.$root.$emit("cadAligned", reAlignedCad);
          }
        });
      this.$bvModal.hide("cadAlignModal");
    },
  },
};
</script>

<style></style>
