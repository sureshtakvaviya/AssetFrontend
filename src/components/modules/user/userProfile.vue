<template>
  <div class="userProfileContainer">
    <b-container>
      <b-row>
        <b-col class="mx-auto my-3" cols="lg-6 md-6 sm-8">
          <b-card class="userProfileCard shadow mx-4 my-2">
            <div class="d-flex justify-content-center">
              <div>
                <label for="userProfilePicFile">
                  <div
                    id="userProfilePicture"
                    class="profile-pic d-flex justify-content-center"
                    :style="imageProp"
                  >
                    <span><i class="fas fa-camera"></i></span>
                    <span>Change Image</span>
                  </div>
                </label>
                <b-form-file
                  name="userProfilePicFile"
                  id="userProfilePicFile"
                  v-model="profilePicFile"
                  accept=".jpg,.jpeg,.png"
                  plain
                  @input="previewProfilePic"
                ></b-form-file>
              </div>
            </div>
            <b-form @submit.prevent="updateProfile">
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
                    <b-form-invalid-feedback
                      v-if="!$v.form.subscription.required"
                    >
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
                    <b-form-invalid-feedback
                      v-if="!$v.form.firstname.minLength"
                    >
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
                    <b-form-invalid-feedback
                      v-if="!$v.form.location.alphaSpaces"
                    >
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
              <div class="text-center">
                <b-button class="primaryBg border-0 m-1" type="submit"
                  >Submit</b-button
                >
              </div>
            </b-form>
            <div class="text-center">
              <h1 class="text-center">Change Password</h1>
            </div>

            <b-form @submit.prevent="changePassword">
              <b-form-row>
                <b-col cols="6">
                  <b-form-group
                    id="oldPassword-input-group"
                    label="Current Password"
                    label-for="oldPassword-input"
                  >
                    <b-form-input
                      id="oldPassword-input"
                      v-model="passwordForm.oldPassword"
                      type="password"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row>
                <b-col>
                  <b-form-group
                    id="newPassword-input-group"
                    label="New Password"
                    label-for="newPassword-input"
                  >
                    <b-form-input
                      id="newPassword-input"
                      v-model="$v.passwordForm.newPassword.$model"
                      :state="validatePasswordForm('newPassword')"
                      type="password"
                      required
                    ></b-form-input>
                    <b-form-invalid-feedback
                      v-if="!$v.passwordForm.newPassword.minLength"
                    >
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
                      v-model="$v.passwordForm.confirmPassword.$model"
                      :state="validatePasswordForm('confirmPassword')"
                      type="password"
                      required
                    ></b-form-input>
                    <b-form-invalid-feedback
                      v-if="!$v.passwordForm.confirmPassword.sameAsPassword"
                    >
                      Passwords do not match
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-button class="primaryBg shadow-sm m-1" type="submit"
                >Submit</b-button
              >
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
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
  name: "userProfile",
  props: {
    userDetails: {
      type: Object,
      default: function() {
        return {
          username: "",
          subscription: null,
          email: "",
          firstname: "",
          lastname: "",
          company: "",
          phone: "",
          location: "",
        };
      },
    },
  },
  data() {
    return {
      form: this.userDetails,
      passwordForm: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      options: [
        { value: null, text: "Please select an option" },
        { value: "Freemium", text: "Freemium" },
        { value: "Premium", text: "Premium" },
        { value: "Enterprise", text: "Enterprise" },
      ],
      profilePicFile: null,
      profilePicBinary: "",
    };
  },
  computed: {
    imageProp: function() {
      let imageProp = {
        backgroundImage: `url(${require("@/assets/img/male-default-icon.png")})`,
      }
      if(this.form.profile_picture)
      {
        imageProp.backgroundImage =  "url(" + this.form.profile_picture + ")";
      }
      return imageProp;
    },
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
    },
    passwordForm: {
      newPassword: {
        required,
        minLength: minLength(6),
      },
      confirmPassword: { required, sameAsPassword: sameAs("newPassword") },
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    validatePasswordForm(name) {
      const { $dirty, $error } = this.$v.passwordForm[name];
      return $dirty ? !$error : null;
    },
    previewProfilePic(file) {
      //read the selected file and attach it to profilePic div for preview
      let reader = new FileReader();

      reader.onload = (e) => {
        let profilePictureContainer = document.getElementById(
          "userProfilePicture"
        );
        profilePictureContainer.style.backgroundImage =
          "url(" + e.target.result + ")";
        this.profilePicBinary = e.target.result;
      };

      reader.readAsDataURL(file);
    },
    updateProfile() {
      if (!this.$v.form.$invalid) {
        //TODO this.$v.form.$error bug update
        let userUpdateData = {
          username: this.form.username,
          subscription: this.form.subscription,
          first_name: this.form.firstname,
          last_name: this.form.lastname,
          email: this.form.email,
          mobile_number: this.form.phone,
          company: this.form.company,
          profile_picture: this.profilePicBinary, //TODO profile picture
        };
        this.$store
          .dispatch("userStore/editUserProfileApi", userUpdateData)
          .then((response) => {
            if (response === "success") {
              this.$root.$emit("showToast", {
                message: `User Profile Updated Successfully`,
                title: "Profile Updated!",
                variant: "success",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            this.$root.$emit("showToast", {
              message: `Error while updating profile. Try again later or contact support`,
              title: "Error!",
              variant: "danger",
            });
          });
      } else {
        this.$root.$emit("showToast", {
          message: `Please fill in all fields with valid data`,
          title: "Validation Error!",
          variant: "danger",
        });
      }
    },
    changePassword() {
      if (!this.$v.passwordForm.$invalid) {
        //TODO this.$v.form.$error bug update
        let passwordUpdateData = {
          oldpassword: this.passwordForm.oldPassword,
          password: this.passwordForm.newPassword,
          password2: this.passwordForm.confirmPassword,
        };
        this.$store
          .dispatch("userStore/changePasswordApi", passwordUpdateData)
          .then((response) => {
            if (response === "success") {
              this.$root.$emit("showToast", {
                message: `Password Changed Successfully`,
                title: "Success!",
                variant: "success",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            this.$root.$emit("showToast", {
              message: `Error while updating password. Make sure to enter your current password correctly`,
              title: "Error!",
              variant: "danger",
            });
          });
      } else {
        this.$root.$emit("showToast", {
          message: `Please fill in all fields with valid data`,
          title: "Validation Error!",
          variant: "danger",
        });
      }
    },
  },
};
</script>

<style scoped>
.userProfileContainer {
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  display: flex;
  align-items: center;
}
.userProfileCard {
  height: 90vh;
  min-width: 40rem;
  max-width: 50rem;
  overflow-y: auto;
}
.container {
  height: 100%;
}
.logo {
  position: fixed;
  top: 0;
  left: 0;
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
