<template>
  <div>
    <div class="my-2 mx-auto w-75 d-flex flex-column justify-content-center">
      <div class="m-1 d-flex justify-content-center align-items-center">
        <div class="w-50">
          <div class="w-50">
            <b-form-group>
              <b-input-group size="sm">
                <b-form-input
                  id="filter-subusers"
                  v-model="filterSubUser"
                  type="search"
                  placeholder="Search Sub-user"
                ></b-form-input>

                <b-input-group-append>
                  <b-button
                    :disabled="!filterSubUser"
                    @click="filterSubUser = ''"
                    >Clear</b-button
                  >
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </div>
        </div>
        <div>
          <i class="fa fa-users fa-2x"></i>
          <b-badge id="activeCount" pill variant="success">{{
            subUsers.length
          }}</b-badge>
        </div>
        <b-button
          @click="addSubUser"
          pill
          variant="secondary"
          :disabled="!canCreateUser"
        >
          + Add User
        </b-button>
      </div>
      <div class="d-flex justify-content-center">
        <b-table
          borderless
          hover
          head-variant="light"
          :fields="fields"
          :items="subUsers"
          responsive="sm"
          :filter="filterSubUser"
          :filter-included-fields="filterOn"
        >
          <!-- TODO Change to actual profile picture -->
          <template #cell(username)="data">
            <div class="d-flex justify-content-between align-items-center">
              <div class="profile_picture mr-2">
                <img
                  :src="data.item.profile_picture ? data.item.profile_picture : require('@/assets/img/male-default-icon.png')
                  "
                />
              </div>
              {{ data.value }}
            </div>
          </template>

          <template #cell(name)="data">
            <b>{{ data.value.first_name | capitalize }}{{ " " }}</b>
            <b>{{ data.value.last_name | capitalize }}</b>
          </template>

          <template #cell(date_created)="data">
            {{ data.value | dateFormat("DD/MM/YYYY") }}
          </template>

          <!-- A virtual column -->
          <template #cell(actions)="data">
            <div class="d-flex">
              <div class="mx-1" @click="editSubUser(data.item)">
                <i class="fas fa-edit"></i>
              </div>
              <div class="mx-1" @click="deleteSubUser(data.item)">
                <i class="fas fa-trash"></i>
              </div>
            </div>
          </template>
        </b-table>
      </div>
    </div>
    <div class="w-75 mx-auto">
      <b-alert v-model="isShareAlertShown" variant="success" dismissible>
        <h4 class="alert-heading">Subuser Created!</h4>
        <p>
          A new subuser has been created. You can choose to download the login
          credentials or share them via email.
        </p>
        <hr />
        <div class="text-right">
          <b-link class="text-primaryBg mr-2" href="#" @click="downloadCSV()"
            ><b><i class="fas fa-download"></i> Download CSV</b></b-link
          >
          |
          <b-link
            class="text-primaryBg ml-2"
            :href="mailToLink"
            @click="this.newUserShared = true"
            ><b><i class="fas fa-share"></i> Share Via Email</b></b-link
          >
        </div>
      </b-alert>
    </div>
    <b-modal
      id="deleteConfirmModal"
      centered
      title="Deletion Confirmation"
      :hide-footer="true"
    >
      <deleteConfirmModal
        :toBeDeleted="toBeDeleted"
        :id="toBeDeletedId"
        :deleteAPI="deleteAOIApi"
      />
    </b-modal>
  </div>
</template>

<script>
import deleteConfirmModal from "@/components/shared/deleteConfirmModal";
export default {
  name: "manageUsers",
  components: { deleteConfirmModal },
  props: {
    subUsers: Array,
  },
  data() {
    return {
      fields: [
        // A virtual column
        "username",
        { key: "name", label: "Full Name" },
        "email",
        "date_created",
        "phone",
        // A virtual column
        "actions",
      ],
      filterSubUser: "",
      filterOn: ["username", "name", "phone"],

      toBeDeleted: "",
      toBeDeletedId: "",
      deleteAOIApi: "userStore/deleteSubUserApi",

      isShareAlertShown: false,
      newUserShared: true,
      downloadUrl: "",
      mailToLink: "",
    };
  },
  computed: {
    canCreateUser: function() {
      return this.subUsers.length < 5 && this.newUserShared;
    },
  },
  methods: {
    addSubUser() {
      this.$store
        .dispatch("userStore/createSubUserApi")
        .then((response) => {
          if (response.data.response === "success") {
            this.downloadUrl = response.data.downloadlink;
            this.newUserShared = false;
            this.isShareAlertShown = true;
            this.constructMailLink();
            this.$root.$emit("showToast", {
              message: "New Sub User Created Successfully",
              title: "User Created!",
              variant: "success",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$root.$emit("showToast", {
            message:
              "Error in user creation. Try again later or contact support",
            title: "User Not Created!",
            variant: "danger",
          });
        });
    },
    editSubUser(subUserId) {
      console.log(subUserId);
    },
    deleteSubUser(subUser) {
      this.toBeDeleted = subUser.username;
      this.toBeDeletedId = subUser.id;
      this.$bvModal.show("deleteConfirmModal");
    },
    downloadCSV() {
      if (this.downloadUrl) {
        let url = this.downloadUrl;
        let filename = "Airmap_Credentials.csv";
        this.$store.dispatch("projectStore/downloadFile", { url, filename });
      }
      this.newUserShared = true;
    },
    constructMailLink() { //TODO dynamic mailTO
      this.mailToLink = `mailto:?subject=Airmap%20Login%20Credentials&body=Hi%2C%0AYou%20have%20been%20added%20as%20an%20user%20to%20the%20project%20______.%20Please%20use%20the%20login%20credentials%20found%20below.%20Kindly%20change%20the%20default%20password%20and%20other%20profile%20settings%20as%20per%20your%20needs.%0AUsername%3A%22%22%2C%0APassword%3A%22%22%2C%0A%0ACheers%20from%20Airmap%20Team.`;
    },
  },
  mounted: function() {
    this.$root.$on("subUserDeleted", (subUserName) => {
      this.$root.$emit("showToast", {
        message: `${subUserName} Deleted Successfully`,
        title: "User Deleted!",
        variant: "success",
      });
    });
    if (this.subUsers.length === 5) {
      this.canCreateUser = false;
    }
  },
};
</script>

<style scoped>
#activeCount {
  position: relative;
  bottom: 20px;
  right: 10px;
}
.profile_picture img {
  width: 40px;
  height: 40px;
  text-align: center;
  border-radius: 50%;
}
</style>
