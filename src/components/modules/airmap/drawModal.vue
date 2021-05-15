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
      <b-button class="float-right border-0 m-2" type="reset" variant="danger"
        >Reset</b-button
      >
      <b-button class="float-right primaryBg border-0 m-2" type="submit" variant="primary"
        >Submit</b-button
      >
    </b-form>
  </div>
</template>

<script>
export default {
  name: "drawModal",
  data() {
    return {
      form: {
        label: "",
        description: "",
        polygon: JSON.stringify(this.polyDimensionProp),
      },
    };
  },
  props: { polyDimensionProp: Array }, // TODO remove prop on confirmation that it's not needed
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      //Attempt saving and on success add the layer to map with label.
      this.$store
        .dispatch("airmapStore/saveAoiApi", this.form)
        .then((response) => {
          if (response === "success") {
            this.$root.$emit("aoiCreated", this.form.label);
          }
        });
      this.$bvModal.hide("polygon-modal");
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
