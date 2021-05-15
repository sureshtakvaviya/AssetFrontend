<template>
  <div>
    <b-card tag="article" class="shadow">
      <div class="d-flex justify-content-center">
        <div class="w-100 d-flex justify-content-center">
          <label for="projectProfilePicFile">
            <div
              id="projectProfilePicture"
              class="profile-pic d-flex justify-content-center"
              :style="imageProp"
            >
              <span><i class="fas fa-camera"></i></span>
              <span>Change Image</span>
            </div>
          </label>
          <b-form-file
            name="projectProfilePicFile"
            id="projectProfilePicFile"
            v-model="projectProfilePicFile"
            accept=".jpg,.jpeg,.png"
            plain
            @input="previewProfilePic"
          ></b-form-file>
        </div>
      </div>
      <b-form @submit.prevent="onSubmit">
        <b-form-row>
          <b-col>
            <b-form-group
              id="title-input-group"
              label="Title"
              label-for="title-input"
            >
              <b-form-input
                id="title-input"
                v-model="$v.form.title.$model"
                type="text"
                :state="validateState('title')"
                required
              ></b-form-input>
              <b-form-invalid-feedback v-if="!$v.form.title.minLength">
                Title must be atleast 3 characters long.
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              id="sector-input-group"
              label="Sector"
              label-for="sector-input"
            >
              <b-form-select
                id="sector-input"
                v-model="form.sector"
                :options="options"
                disabled
                required
              ></b-form-select>
            </b-form-group>
          </b-col>
        </b-form-row>

        <b-form-row>
          <b-col>
            <b-form-group
              id="country-input-group"
              label="Country"
              label-for="country-input"
            >
              <b-form-input
                id="country-input"
                v-model="form.country"
                disabled
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              id="state-input-group"
              label="State"
              label-for="state-input"
            >
              <b-form-input
                id="state-input"
                v-model="form.state"
                disabled
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-form-row>

        <b-form-row>
          <b-col>
            <b-form-group
              id="city-input-group"
              label="City"
              label-for="city-input"
            >
              <b-form-input
                id="city-input"
                v-model="form.city"
                disabled
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col> </b-col>
        </b-form-row>

        <b-form-row>
          <b-col>
            <b-form-group
              id="description-input-group"
              label="Description"
              label-for="description-input"
            >
              <b-form-textarea
                id="description-input"
                v-model="$v.form.description.$model"
                type="text"
                :state="validateState('description')"
                required
              ></b-form-textarea>
              <b-form-invalid-feedback v-if="!$v.form.description.minLength">
                Description must be atleast 3 characters long.
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-form-row>

        <b-form-row>
          <b-col cols="6">
            <b-form-group
              id="date-input-group"
              label="Date"
              label-for="date-input"
            >
              <b-form-datepicker
                id="date-input"
                v-model="form.created_date"
                type="date"
                disabled
              ></b-form-datepicker>
            </b-form-group>
          </b-col>
        </b-form-row>

        <b-button class="primaryBg shadow-sm m-1" type="submit"
          >Submit</b-button
        >
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";
export default {
  name: "editProject",
  props: ["projectData"],
  data() {
    return {
      form: this.projectData,
      options: [
        { value: null, text: "Please select an option" },
        { value: "Solar_Site", text: "Solar" },
        { value: "Construction_Site", text: "Construction" },
      ],
      projectProfilePicFile: null,
      profilePicBinary: "",
    };
  },
  computed: {
    imageProp: function() {
      let imageProp = { backgroundImage: `` };
      if (this.form.projectprofileimage) {
        imageProp.backgroundImage =
          "url(" + this.form.projectprofileimage + ")";
        return imageProp;
      }

      let sector = this.form.sector;
      if (sector) {
        if (sector === "Construction_Site") {
          imageProp = {
            backgroundImage: `url(${require("@/assets/img/construction-default-pic2.jpg")})`,
          };
        } else {
          imageProp = {
            backgroundImage: `url(${require("@/assets/img/solar-default-pic.jpg")})`,
          };
        }
      }
      return imageProp;
    },
  },
  validations: {
    form: {
      title: {
        required,
        minLength: minLength(3),
      },
      description: {
        required,
        minLength: minLength(3),
      },
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
          "projectProfilePicture"
        );
        profilePictureContainer.style.backgroundImage =
          "url(" + e.target.result + ")";
        this.profilePicBinary = e.target.result;
      };

      reader.readAsDataURL(file);
    },
    onSubmit() {
      if (!this.$v.form.$error) {
        let projectUpdateData = {
          id: this.form.id,
          title: this.form.title,
          description: this.form.description,
          projectprofileimage: this.profilePicBinary,
        };
        this.$store
          .dispatch("homeStore/editProjectApi", projectUpdateData)
          .then((response) => {
            if (response === "success") {
              this.handleToast(
                "Success",
                "Your changes are saved successfully",
                "success"
              );
              this.$bvModal.hide("editProjectModal");
            }
          })
          .catch((error) => {
            console.log(error);
            this.handleToast(
              "Project Not Edited",
              "There has been an error in editing your project. Try again or contact support",
              "danger"
            );
          });
      } else {
        this.handleToast(
          "Validation Error",
          "Please Fill in all fields with valid Data",
          "danger"
        );
      }
    },
    handleToast(
      title = "Error!",
      message = "Communication Error",
      variant = "danger"
    ) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: false,
        variant: variant,
      });
    },
  },
};
</script>

<style scoped>
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
  border-radius: 10px;
  height: 150px;
  width: 300px;
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
