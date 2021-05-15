<template>
  <div>
    <p> Are you sure you want to delete <b>{{ toBeDeleted }}</b>?</p>
    <b-button
      class="primaryBg float-right m-2"
      @click="onCancel"
      >No</b-button
    >
    <b-button
      class="primaryBg float-right m-2"
      @click="onConfirm"
      >Yes</b-button
    >
  </div>
</template>

<script>
export default {
  name: "deleteConfirmModal",
  props: {
    toBeDeleted: String,
    id: Number,
    deleteAPI: String,
  },
  data() {
    return {};
  },
  methods: {
    onConfirm() {
      this.$store.dispatch(this.deleteAPI, this.id).then((response) => {
        if (response !=='error') {
          this.$root.$emit(response,this.toBeDeleted);
        }
      });
      this.$bvModal.hide("deleteConfirmModal");
    },
    onCancel() {
      this.$bvModal.hide("deleteConfirmModal");
    },
  },
};
</script>

<style scoped>
</style>
