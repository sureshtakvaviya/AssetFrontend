<template>
  <div>
    <b-form @submit.prevent="onSubmit">
      <b-form-group
        id="input-group-label"
        label="Name:"
        label-for="input-label"
      >
        <b-form-input
          id="input-label"
          v-model="$v.form.label.$model"
          :state="validateState('label')"
          type="text"
          required
        ></b-form-input>
        <b-form-invalid-feedback v-if="!$v.form.label.minLength">
          Name must be atleast 3 characters long.
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        id="input-group-description"
        label="Description:"
        label-for="input-description"
      >
        <b-form-input
          id="input-description"
          v-model="$v.form.description.$model"
          :state="validateState('description')"
          required
        ></b-form-input>
        <b-form-invalid-feedback v-if="!$v.form.description.minLength">
          Description must be atleast 3 characters long.
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        id="input-group-startdate"
        label="Start Date:"
        label-for="input-startdate"
      >
        <b-form-datepicker
          id="input-startdate"
          v-model="$v.form.startdate.$model"
          :state="validateState('startdate')"
          type="date"
          required
          :min="today"
        ></b-form-datepicker>
        <b-form-invalid-feedback v-if="!$v.form.startdate.required">
          Start Date is required
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        id="input-group-enddate"
        label="End Date:"
        label-for="input-enddate"
      >
        <b-form-datepicker
          id="input-enddate"
          v-model="$v.form.enddate.$model"
          :state="validateState('enddate')"
          type="date"
          :min="form.startdate"
          required
        ></b-form-datepicker>
        <b-form-invalid-feedback v-if="!$v.form.enddate.required">
          End Date is required
        </b-form-invalid-feedback>
      </b-form-group>
      <b-button class="primaryBg float-right m-2" type="submit"
        >Submit</b-button
      >
    </b-form>
  </div>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";
export default {
  name: "createActivityModal",
  data() {
    return {
      form: {
        label: "",
        description: "",
        startdate: "",
        enddate: "",
      },
      today: new Date(),
      priorityOptions: [
        { value: "High", text: "High" },
        { value: "Medium", text: "Medium" },
        { value: "Low", text: "Low" },
      ],
    };
  },
  validations: {
    form: {
      label: {
        required,
        minLength: minLength(3),
      },
      description: {
        required,
        minLength: minLength(3),
      },
      startdate: {
        required,
      },
      enddate: {
        required,
      },
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    onSubmit() {
      //Attempt saving and on success add the layer to map with label.
      if (!this.$v.form.$invalid) {// $invalid and $error bug in the vuelidate. TODO check updates
        this.$store
          .dispatch("projectStore/createNewActivity", this.form)
          .then((response) => {
            if (response === "success") {
              this.$root.$emit("showToast", {
                message: `${this.form.label} created successfully`,
                title: "Activity Created",
                variant: "success",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            this.handleToast({
              title: "Activity Not Created",
              message:
                "There has been an error in creating your activity. Try again or contact support",
              variant: "danger",
            });
          });
        this.$bvModal.hide("createActivityModal");
      } else {
        this.handleToast({
          title: "Validation Error",
          message: "Please Fill in all fields with valid data",
          variant: "danger",
        });
      }
    },
    handleToast(toastData) {
      this.$root.$emit("showToast", toastData);
    },
  },
};
</script>

<style></style>
