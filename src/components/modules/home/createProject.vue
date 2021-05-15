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
                v-model="$v.form.sector.$model"
                :options="options"
                :state="validateState('sector')"
                required
              ></b-form-select>
              <b-form-invalid-feedback v-if="!$v.form.sector.required">
                Please Select a sector type
              </b-form-invalid-feedback>
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
              <b-form-select
                id="country-input"
                v-model="$v.form.country.$model"
                :options="countriesList"
                :state="validateState('country')"
                required
                @change="getStatesList"
              ></b-form-select>
              <b-form-invalid-feedback v-if="!$v.form.country.required">
                Please Select a country
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              id="state-input-group"
              label="State"
              label-for="state-input"
            >
              <b-form-select
                id="state-input"
                v-model="$v.form.state.$model"
                :options="statesList"
                :state="validateState('state')"
                required
                @change="getCitiesList"
              ></b-form-select>
              <b-form-invalid-feedback v-if="!$v.form.state.required">
                Please Select a state
              </b-form-invalid-feedback>
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
              <b-form-select
                id="city-input"
                v-model="$v.form.city.$model"
                :options="citiesList"
                :state="validateState('city')"
                required
              ></b-form-select>
              <b-form-invalid-feedback v-if="!$v.form.city.required">
                Please Select a city
              </b-form-invalid-feedback>
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
        <b-button class="primaryBg shadow-sm m-1" type="submit"
          >Submit</b-button
        >
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { required, minLength } from "vuelidate/lib/validators";
export default {
  name: "createProject",
  data() {
    return {
      form: {
        title: "",
        sector: "Construction_Site",
        description: "",
        lastname: "",
        country: null,
        state: null,
        city: null,
      },
      options: [
        { value: "Solar_Site", text: "Solar" },
        { value: "Construction_Site", text: "Construction" },
      ],
      projectProfilePicFile: null,
      profilePicBinary: "",
    };
  },
  validations: {
    form: {
      title: {
        required,
        minLength: minLength(3),
      },
      sector: {
        required,
      },
      description: {
        required,
        minLength: minLength(3),
      },
      country: {
        required,
      },
      state: {
        required,
      },
      city: {
        required,
      },
    },
  },
  computed: {
    ...mapGetters({
      countriesList: "homeStore/getCountriesList",
      statesList: "homeStore/getStatesList",
      citiesList: "homeStore/getCitiesList",
    }),
    rows: function() {
      return this.datesArray.length ? this.datesArray.length : 0;
    },
    imageProp: function() {
      let sector = this.form.sector;
      let imageProp = { backgroundImage: `` };
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
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    getStatesList(country) {
      this.$store.dispatch("homeStore/getStatesListApi", country.id);
    },
    getCitiesList(state) {
      let locationData = {
        countryId: this.form.country.id,
        stateId: state.id,
      };
      this.$store.dispatch("homeStore/getCitiesListApi", locationData);
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
        let newProjectData = {
          title: this.form.title,
          sector: this.form.sector,
          description: this.form.description,
          country: this.form.country.name,
          state: this.form.state.name,
          city: this.form.city.name,
          projectprofileimage: this.profilePicBinary,
        };
        this.$store
          .dispatch("homeStore/createProjectApi", newProjectData)
          .then((response) => {
            if (response === "success") {
              this.handleToast({
                title: "Project Created",
                message: `Your project "${newProjectData.title} is created successfully`,
                variant: "success",
              });
              this.$bvModal.hide("createProjectModal");
            }
          })
          .catch((error) => {
            console.log(error);
            this.handleToast({
              title: "Project Not Created",
              message:
                "There has been an error in creating your project. Try again or contact support",
              variant: "danger",
            });
          });
      } else {
        this.handleToast({
          title: "Validation Error",
          message: "Please Fill in all fields with valid Data",
          variant: "danger",
        });
      }
    },
    handleToast(toastData) {
      this.$root.$emit("showToast", toastData);
    },
  },
  mounted() {
    //getting countriesList from geodata api
    this.$store.dispatch("homeStore/getCountriesListApi");
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
