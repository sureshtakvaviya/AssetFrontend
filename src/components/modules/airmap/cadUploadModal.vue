<template>
  <div>
    <b-form @submit.prevent="cadUploaded" @reset.prevent="onReset">
      <b-form-group
        id="input-group-label"
        label="Label"
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
        id="input-group-cadfile"
        label="CAD File"
        label-for="input-cadfile"
      >
        <b-form-file
          id="input-cadfile"
          v-model="form.cadFile"
          :state="Boolean(form.cadFile)"
          accept=".kml"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here..."
          required
        ></b-form-file>
      </b-form-group>
      <b-button type="submit" class="float-right mt-3" variant="success"
        >Upload</b-button
      >
    </b-form>
  </div>
</template>

<script>
export default {
  name: "cadUploadModal",
  data() {
    return {
      form: {
        label: "",
        cadFile: null,
      },
    };
  },
  methods: {
    cadUploaded() {
      let cadFile = new FormData();
      cadFile.append("FILES", this.form.cadFile);
      let cadUploadData = { label: this.form.label, cadFile: cadFile };
      this.$store
        .dispatch("airmapStore/cadAlignUploadApi", cadUploadData)
        .then((response) => {
          if (response.cad) {
            //converting the response into an object compatiple with the cad rendering function
            let uploadedCad = {
              uploaded_cad_kml: response.cad,
              label: this.form.label,
              realign_cad_kml: [],
              id: response.id,
              uploaded_by: response.uploaded_by,
              creation_date: this.$options.filters.dateFormat(new Date, 'YYYY-MM-DD')
            };
            this.$root.$emit("cadUploaded", uploadedCad);
          }
        });
      this.$bvModal.hide("cadUploadModal");
    },
    onReset() {
      // Reset form values
      this.form.label = "";
    },
  },
};
</script>

<style></style>
