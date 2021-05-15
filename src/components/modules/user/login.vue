<template>
  <div class="loginContainer">
    <b-card tag="article" style="min-width:25rem;" class="shadow mx-auto"
      ><div class="text-primaryBg text-center">
        <i class="fa fa-user-circle fa-3x"></i>
      </div>
      <b-form @submit.prevent="onSubmit">
        <div class="text-center">
          <b class="text-center">Welcome Back!</b>
        </div>
        <b-input-group id="userName-input-group">
          <template #prepend>
            <b-input-group-text
              ><i class="fa fa-envelope"></i
            ></b-input-group-text>
          </template>
          <b-form-input
            id="userName-input"
            v-model="form.userName"
            type="text"
            required
            placeholder="Username / Email"
          ></b-form-input>
        </b-input-group>
        <b-input-group id="password-input-group">
          <template #prepend>
            <b-input-group-text><i class="fa fa-lock"></i></b-input-group-text>
          </template>
          <b-form-input
            id="password-input"
            v-model="form.password"
            type="password"
            required
            placeholder="Enter your password"
          ></b-form-input>
        </b-input-group>
        <div class="d-flex justify-content-between">
          <div>
            <b-form-checkbox
              id="checkbox-remember"
              v-model="isRemeber"
              name="checkbox-remember"
              value="true"
              unchecked-value="not_accepted"
            >
              Remember Me
            </b-form-checkbox>
          </div>
          <div class="text-center">
           <b-link class="text-primaryBg" href="#" @click="routeToRecovery">Forgot Password?</b-link>
          </div>
        </div>
        <div class="text-center">
          <b-button class="primaryBg w-75 shadow-sm mt-3" type="submit"
            >Login</b-button
          >
        </div>
        <hr>
        <p class="mt-2">
          Don't have an account?
          <b-link class="text-primaryBg" href="#" @click="routeToRegister">Sign Up</b-link>
        </p>
      </b-form>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      form: {
        userName: "",
        password: "", //TODO show/hide password toggle
      },
      isRemeber:false,
    };
  },
  methods: {
    onSubmit() {
      let userCredentials = {};
      if (this.validateEmail(this.form.userName)) {
        userCredentials.email = this.form.userName;
        userCredentials.password = this.form.password;
      } else {
        (userCredentials.username = this.form.userName),
          (userCredentials.password = this.form.password);
      }
      this.$store
        .dispatch("userStore/login", userCredentials)
        .then((response) => {
          if (response === "success") {
            //Redirecting the user to redirect location if it exists otherwise to homepage
            let redirectTo = this.$route.query.redirect
              ? this.$route.query.redirect
              : "/home";
            this.$router.push(redirectTo);
          }
        })
        .catch((error) => {
          console.log(error);
          this.$bvToast.toast(`Enter valid username and password`, {
            title: "Invalid Credentials",
            autoHideDelay: 2000,
            appendToast: false,
            variant: "danger",
          });
        });
    },
    //A generic email validation function using regex
    validateEmail(email) {
      // eslint-disable-next-line no-useless-escape
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    routeToRegister() {
      this.$router.push("/register");
    },
    routeToRecovery() {
      this.$router.push("/account-recovery");
       /* background-image: url(~@/assets/img/login-signup-bg.svg); */
    },
  },
};
</script>

<style scoped>
.loginContainer {
 
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
.btn-outline-primary {
  color: var(--primaryBg);
  border-color: var(--primaryBg);
}
.btn-outline-primary:hover {
  background-color: var(--primaryBg);
  color: var(--light);
  border-color: var(--light);
}
.btn-outline-primary:active {
  background-color: var(--primaryBg);
  color: var(--light);
  border-color: var(--light);
}
.input-group {
  margin: 2rem 0;
}
</style>
