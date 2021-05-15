<template>
  <div class="accountRecoveryContainer">
    <b-card tag="article" style="min-width:25rem;" class="shadow mx-auto"
      ><div class="text-center">
        <div class="text-primaryBg text-center">
          <i class="fa fa-unlock-alt fa-3x"></i>
        </div>
      </div>
      <b-form @submit.prevent="onSubmit">
        <div class="text-center">
          <b class="text-center">Account Recovery</b>
        </div>

        <b-form-group
          id="email-input-group"
          label="Enter your registered email"
          label-for="email-input"
        >
          <b-form-input
            id="email-input"
            v-model="$v.form.email.$model"
            type="email"
            :state="validateState('email')"
            required
          ></b-form-input>
          <b-form-invalid-feedback>
            Enter a valid Email Id. Eg: don@example.com
          </b-form-invalid-feedback>
        </b-form-group>
        <div class="d-flex flex-column align-items-center">
          <b-button class="primaryBg w-50 shadow-sm m-2" type="submit"
            >Submit</b-button
          >
          <b-button
            pill
            class="shadow-sm"
            @click="routeToLogin"
            variant="outline-secondary"
            >Back to Login Page</b-button
          >
        </div>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { email } from "vuelidate/lib/validators";
export default {
  name: "accountRecovery",
  data() {
    return {
      form: {
        email: "",
      },
    };
  },
  validations: {
    form: {
      email: {
        email,
      },
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    onSubmit() {
      if (!this.$v.form.$error) {
        console.log(this.email); //TODO password reset logic
      } else {
        this.$bvToast.toast(`Please fill in with a valid email`, {
          title: "Validation Error!",
          autoHideDelay: 2000,
          appendToast: false,
          variant: "danger",
        });
      }
    },
    routeToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.accountRecoveryContainer {
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #eceff1;
  background-blend-mode: overlay;

  display: flex;
  justify-content: center;
  align-items: center;
}
.logo {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
