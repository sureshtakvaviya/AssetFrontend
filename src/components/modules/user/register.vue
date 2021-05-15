<template>
  <div class="registerContainer">
    <b-card class="registerCard shadow mx-4 my-2">
      <div class="d-flex justify-content-center">
        <div>
          <label for="fileToUpload">
            <div
              id="registerProfilePicture"
              class="profile-pic d-flex justify-content-center"
              :style="defaultImageProp"
            >
              <span><i class="fas fa-camera"></i></span>
              <span>Change Image</span>
            </div>
          </label>
          <b-form-file
            name="fileToUpload"
            id="fileToUpload"
            v-model="profilePicFile"
            accept=".jpg,.jpeg,.png"
            plain
            @input="previewProfilePic"
          ></b-form-file>
        </div>
      </div>
      <b-form @submit.prevent="onSubmit">
        <div class="text-center">
          <b class="text-center">Be One of Us!</b>
          <hr />
        </div>
        <b-form-row>
          <b-col>
            <b-form-group
              id="username-input-group"
              label="Username"
              label-for="username-input"
            >
              <b-form-input
                id="username-input"
                v-model="$v.form.username.$model"
                type="text"
                :state="validateState('username')"
                required
              ></b-form-input>
              <b-form-invalid-feedback v-if="!$v.form.username.minLength">
                Username must be atleast 3 characters long.
              </b-form-invalid-feedback>
              <b-form-invalid-feedback v-if="!$v.form.username.alphaNum">
                Username must be alphanumeric without spaces or special
                characters
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              id="subscription-input-group"
              label="Subscription"
              label-for="subscription-input"
            >
              <b-form-select
                id="subscription-input"
                v-model="$v.form.subscription.$model"
                :options="options"
                :state="validateState('subscription')"
                required
              ></b-form-select>
              <b-form-invalid-feedback v-if="!$v.form.subscription.required">
                Please Select a subscription type
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-form-row>

        <b-form-row>
          <b-col>
            <b-form-group
              id="firtname-input-group"
              label="First Name"
              label-for="firstname-input"
            >
              <b-form-input
                id="firstname-input"
                v-model="$v.form.firstname.$model"
                type="text"
                :state="validateState('firstname')"
                required
              ></b-form-input>
              <b-form-invalid-feedback v-if="!$v.form.firstname.minLength">
                First Name must be atleast 3 characters long.
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              id="last-input-group"
              label="Last Name"
              label-for="firstname-input"
            >
              <b-form-input
                id="last-input"
                v-model="$v.form.lastname.$model"
                type="text"
                :state="validateState('lastname')"
                required
              ></b-form-input>
              <b-form-invalid-feedback v-if="!$v.form.lastname.minLength">
                Last Name must be atleast 3 characters long.
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-form-row>

        <b-form-row>
          <b-col>
            <b-form-group
              id="company-input-group"
              label="Company"
              label-for="company-input"
            >
              <b-form-input
                id="company-input"
                v-model="$v.form.company.$model"
                type="text"
                :state="validateState('company')"
                required
              ></b-form-input>
              <b-form-invalid-feedback v-if="!$v.form.company.minLength">
                Company Name must be atleast 3 characters long.
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              id="location-input-group"
              label="Location"
              label-for="location-input"
            >
              <b-form-input
                id="location-input"
                v-model="$v.form.location.$model"
                :state="validateState('location')"
                type="text"
                required
              ></b-form-input>
              <b-form-invalid-feedback v-if="!$v.form.location.alphaSpaces">
                Location can contain only alphanumerals and '-'
              </b-form-invalid-feedback>
              <b-form-invalid-feedback v-if="!$v.form.location.minLength">
                Location must be atleast 3 characters long.
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-form-row>

        <b-form-row>
          <b-col>
            <b-form-group
              id="phone-input-group"
              label="Phone Number"
              label-for="phone-input"
            >
              <b-form-input
                id="phone-input"
                v-model="$v.form.phone.$model"
                :state="validateState('phone')"
                type="number"
                required
              ></b-form-input>
              <b-form-invalid-feedback v-if="!$v.form.phone.minLength">
                Must be atleast 10 numbers
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              id="email-input-group"
              label="Email Address"
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
          </b-col>
        </b-form-row>

        <b-form-row>
          <b-col>
            <b-form-group
              id="password-input-group"
              label="Password"
              label-for="password-input"
            >
              <b-form-input
                id="password-input"
                v-model="$v.form.password.$model"
                :state="validateState('password')"
                type="password"
                required
              ></b-form-input>
              <b-form-invalid-feedback v-if="!$v.form.password.minLength">
                Password must be atleast 6 characters long.
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              id="confirmPassword-input-group"
              label="Confirm Password"
              label-for="confirmPassword-input"
            >
              <b-form-input
                id="confirmPassword-input"
                v-model="$v.form.confirmPassword.$model"
                :state="validateState('confirmPassword')"
                type="password"
                required
              ></b-form-input>
              <b-form-invalid-feedback
                v-if="!$v.form.confirmPassword.sameAsPassword"
              >
                Passwords do not match
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-form-row>
        <div class="text-center">
          <b-button class="primaryBg w-75 shadow-sm m-1" type="submit"
            >Submit</b-button
          >
        </div>
        <p class="mt-2">
          Already have an account?
          <b-link class="text-primaryBg" href="#" @click="routeToLogin"
            >Login</b-link
          >
        </p>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { helpers } from "vuelidate/lib/validators";
const alphaSpaces = helpers.regex("alphaSpaces", /^[\w\-\s]+$/);
import {
  required,
  email,
  minLength,
  alphaNum,
  numeric,
  sameAs,
} from "vuelidate/lib/validators";
export default {
  name: "register",
  data() {
    return {
      form: {
        username: "",
        subscription: null,
        email: "",
        firstname: "",
        lastname: "",
        company: "",
        phone: "",
        location: "",
        password: "",
        confirmPassword: "",
      },
      options: [
        { value: null, text: "Please select an option" },
        { value: "Freemium", text: "Freemium" },
        { value: "Premium", text: "Premium" },
        { value: "Enterprise", text: "Enterprise" },
      ],

      defaultImageProp: {
        backgroundImage: `url(${require("@/assets/img/male-default-icon.png")})`,
      },
      profilePicFile: null,
      profilePicBinary: "",
    };
  },
  validations: {
    form: {
      username: {
        required,
        minLength: minLength(3),
        alphaNum,
      },
      subscription: {
        required,
      },
      email: {
        required,
        email,
      },
      firstname: {
        required,
        minLength: minLength(3),
      },
      lastname: {
        required,
        minLength: minLength(3),
      },
      company: {
        required,
        minLength: minLength(3),
      },
      phone: {
        required,
        numeric,
        minLength: minLength(10),
      },
      location: {
        required,
        alphaSpaces,
        minLength: minLength(3),
      },
      password: {
        required,
        minLength: minLength(6),
      },
      confirmPassword: { required, sameAsPassword: sameAs("password") },
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    previewProfilePic(file) {
      //read the selected file and attach it to profilePic div for preview
      let reader = new FileReader();

      reader.onload = (e) => {
        let profilePictureContainer = document.getElementById(
          "registerProfilePicture"
        );
        profilePictureContainer.style.backgroundImage =
          "url(" + e.target.result + ")";
        this.profilePicBinary = e.target.result;
        console.log(this.profilePicBinary);
      };

      reader.readAsDataURL(file);
    },
    onSubmit() {
      if (!this.$v.form.$error) {
        let newUserData = {
          username: this.form.username,
          subscription: this.form.subscription,
          firstname: this.form.firstname,
          lastname: this.form.lastname,
          email: this.form.email,
          mobile_number: this.form.phone,
          company: this.form.company,
          location: this.form.location,
          password: this.form.password,
          password2: this.form.confirmPassword,
          profile_picture: this.profilePicBinary,
        };
        this.$store
          .dispatch("userStore/register", newUserData)
          // eslint-disable-next-line no-unused-vars
          .then((response) => {
            if (response === "success") {
              let userCredentials = {
                email: this.form.email,
                password: this.form.password,
              };
              this.$store
                .dispatch("userStore/login", userCredentials)
                .then((response) => {
                  if (response === "success") {
                    this.$router.push("/home");
                  }
                })
                .catch((error) => {
                  console.log(error);
                  this.$bvToast.toast(
                    `Error while logging in. Try again later or contact support`,
                    {
                      title: "Error!",
                      autoHideDelay: 2000,
                      appendToast: false,
                      variant: "danger",
                    }
                  );
                });
            }
          })
          .catch((error) => {
            console.log(error);
            this.$bvToast.toast(
              `Error while registering. Try again later or contact support`,
              {
                title: "Error!",
                autoHideDelay: 2000,
                appendToast: false,
                variant: "danger",
              }
            );
          });
      } else {
        this.$bvToast.toast(`Please fill in all fields with valid data`, {
          title: "Validation Error!",
          autoHideDelay: 2000,
          appendToast: false,
          variant: "danger",
        });
      }
    },
    routeToLogin() {
      this.$router.push("/login");
      /* background-image: url(~@/assets/img/login-signup-bg.svg); */
    },
  },
};
</script>

<style scoped>
.registerContainer {
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #eceff1;
  background-blend-mode: overlay;

  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}
.registerCard {
  height: 90vh;
  min-width: 40rem;
  max-width: 50rem;
  overflow-y: auto;
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

/*Primary Button */
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
.profile-pic {
  border-radius: 50%;
  height: 150px;
  width: 150px;
  background-size: cover;
  background-position: center;
  background-blend-mode: multiply;
  vertical-align: middle;
  text-align: center;
  color: transparent;
  transition: all 0.3s ease;
  text-decoration: none;
  cursor: pointer;
}

.profile-pic:hover {
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  color: #fff;
  transition: all 0.3s ease;
  text-decoration: none;
}

.profile-pic span {
  display: inline-block;
  padding-top: 4.5em;
  padding-bottom: 4.5em;
}

input[type="file"] {
  display: none;
  cursor: pointer;
}
</style>
