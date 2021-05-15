<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group
        id="input-group-label"
        label="Label:"
        label-for="input-label"
      >
        <b-form-input
          id="input-label"
          v-model="form.label"
          type="text"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-desc"
        label="Description:"
        label-for="input-desc"
      >
        <b-form-input
          id="input-description"
          v-model="form.description"
          required
        ></b-form-input>
      </b-form-group>
      <b-card class="mt-3" header="Area">
        <pre class="m-0">{{ measureDetails.areaDisplay }}</pre>
      </b-card>
      <b-card class="mt-3" header="Length">
        <pre class="m-0">{{ measureDetails.lengthDisplay }}</pre>
      </b-card>
      <b-button class="float-right border-0 mt-2 mx-2" type="reset" variant="danger"
        >Reset</b-button
      >
      <b-button class="float-right primaryBg border-0 mt-2" type="submit" 
        >Submit</b-button
      >
    </b-form>
  </div>
</template>

<script>
export default {
  name: "measureModal",
  data() {
    return {
      form: {
        label: "",
        description: "",
      },
      show: true,
    };
  },
  props: { measureDetails: Object },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      //The measure object can be of type "Point","Line","Poly" based on the number of points 
      let measureType = "point";
      if (this.measureDetails.points.length > 1) {
        measureType = this.measureDetails.points.length === 2 ? "line" : "poly";
      }
      let measureSaveData = {
        label: this.form.label,
        description: this.form.description,
        type: measureType,
        area: this.measureDetails.area,
        length: this.measureDetails.length,
        polygon: JSON.stringify(this.measureDetails.points),
      };

      //Attempt saving and on success add the layer to map with label.
      this.$store
        .dispatch("airmapStore/saveMeasureApi", measureSaveData)
        .then((response) => {
          if (response === "success") {
            this.$root.$emit("measureCreated", this.form.label);
          }
        });
      this.$bvModal.hide("measureModal");
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.label = "";
      this.form.description = "";
    },
  },
};
</script>

<style></style>
