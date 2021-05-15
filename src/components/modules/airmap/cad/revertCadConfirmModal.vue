<template>
  <div>
    <p> Are you sure you want to revert the alignment of <b>{{ cadLabel }}</b>?</p>
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
  name: "revertCadConfirmModal",
  props: {
    cadLabel:String,
    cadId: Number,
  },
  data() {
    return {};
  },
  methods: {
    onConfirm() {
      this.$store.dispatch("airmapStore/revertRealignApi", this.cadId).then((response) => {
        if (response !=='error') {
          this.$root.$emit(response,this.toBeDeleted);
        }
      });
      this.$bvModal.hide("revertCadConfirmModal");
    },
    onCancel() {
      this.$bvModal.hide("revertCadConfirmModal");
    },
  },
};
</script>

<style scoped>
</style>
