<template>
  <div>
    <div>
      <b-table
        :caption-top="true"
        :items="subUsersWithoutAccess"
        :fields="fields"
        :select-mode="selectMode"
        responsive="sm"
        ref="selectableTable"
        selectable
        @row-selected="onRowSelected"
      >
        <template #table-caption
          >Select the users by clicking on the corresponding row</template
        >
        <template #cell(selected)="{ rowSelected }">
          <template v-if="rowSelected">
            <div class="text-center">
              <i class="far fa-check-square"></i>
            </div>
            <span class="sr-only">Selected</span>
          </template>
          <template v-else>
            <div class="text-center">
              <i class="far fa-square"></i>
            </div>
            <span class="sr-only">Not selected</span>
          </template>
        </template>
      </b-table>
      <b-form @submit.prevent="onSubmit">
        <b-form-group
          id="input-group-accesstype"
          label="Access Type:"
          label-for="input-accesstype"
        >
          <b-form-select
            id="input-accesstype"
            v-model="form.accesstype"
            :options="accessOptions"
            required
          ></b-form-select>
        </b-form-group>
        <div class="text-right">
          <b-button class="primaryBg flex-right" type="submit">Submit</b-button>
        </div>
      </b-form>
    </div>
    <div class="my-3">
      <b-card>
        <b-card-title>
          <div class="d-flex align-items-center">
            <h4>
              Access List
              <span style="font-size:16px"
                ><i
                  class="fas fa-info-circle"
                  v-b-tooltip.hover.top.html="infoText"
                  aria-hidden="true"
                ></i
              ></span>
            </h4>
          </div>
        </b-card-title>
        <div class="d-flex flex-column">
          <div
            class="accessListItem d-flex justify-content-around"
            v-for="(access, index) in accessList"
            :key="access.user.id"
          >
            <span>{{ index + 1 }} . </span>
            <span class="text-capitalize">{{ access.user.username }} </span>
            <VueToggles
              @click="
                switchChanged({
                  userId: access.user.id,
                  is_write: access.is_write,
                })
              "
              :value="access.is_write"
              height="25"
              width="80"
              checkedText="Write"
              uncheckedText="Read"
              checkedBg="#28a745"
              uncheckedBg="#007bff"
              fontSize="20px"
              fontWeight="500"
            />
            <span
              v-b-tooltip.hover
              title="Remove Access"
              role="button"
              class="text-danger"
              @click="removeAccess(access.user.id)"
              ><i class="fas fa-times"></i
            ></span>
          </div>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/valid-v-model */
export default {
  name: "shareModal",
  props: { projectId: { type: Number } },
  data() {
    return {
      form: {
        accesstype: null,
      },
      accessOptions: [
        { value: null, text: "Please select an option" },
        { value: "write_only", text: "Write" },
        { value: "read_only", text: "Read" },
      ],
      fields: ["selected", "username", "email"],
      selectMode: "multi",
      selected: [],
      selectTrue: true,
      infoText:
        'Users with <strong>"Write"</strong> access can <strong>create, edit and delete</strong> content while those with <strong>"Read"</strong> can <strong>only view</strong> data.',
    };
  },
  computed: {
    project: function() {
      let project = this.$store.getters["homeStore/getProjectById"](
        this.projectId
      );
      return project ? project : {};
    },
    subUsers: function() {
      let subUsers = this.$store.getters["userStore/getAllSubUsers"];
      return subUsers ? subUsers : [];
    },
    accessList: function() {
      let accessList = [];
      let writeAccessList = this.project.write_access.map((user) => {
        return { user: user, is_write: true };
      });
      let readAccessList = this.project.read_access.map((user) => {
        return { user: user, is_write: false };
      });
      accessList.push(...writeAccessList);
      accessList.push(...readAccessList);
      return accessList ? accessList : [];
    },
    subUsersWithoutAccess: function() {
      let subUsersWithAccess = this.accessList.map(
        (subUser) => subUser.user.username
      );
      let subUsersWithoutAccess = this.subUsers.filter(
        (subUser) => !subUsersWithAccess.includes(subUser.username)
      );
      return subUsersWithoutAccess ? subUsersWithoutAccess : [];
    },
  },
  methods: {
    onRowSelected(items) {
      this.selected = items;
    },
    onSubmit() {
      let selectedUsers = this.selected.map((user) => user.id);
      let accessData = [];
      selectedUsers.forEach((userId) => {
        accessData.push({
          userId: userId,
          accessType: this.form.accesstype,
        });
      });
      this.changeAccess(accessData);
    },
    switchChanged(switchData) {
      let accessData = [
        {
          userId: switchData.userId,
          accessType: switchData.is_write ? "read_only" : "write_only",
        },
      ];
      this.changeAccess(accessData);
    },
    removeAccess(subUserID) {
      let accessData = [
        {
          userId: subUserID,
          accessType: "remove",
        },
      ];
      this.changeAccess(accessData);
    },
    changeAccess(accessData) {
      let shareData = { accessData: accessData };
      let requestData = {
        shareData: shareData,
        projectId: this.project.id,
      };
      //Attempt changing access status.
      this.$store
        .dispatch("homeStore/provideAccessApi", requestData)
        .then((response) => {
          if (response === "success") {
            this.$root.$emit("showToast", {
              message: "Project Shared Successfully",
              title: "Success",
              variant: "success",
            });
          } else {
            this.$root.$emit("showToast", {
              message: "Error in Sharing your project",
              title: "Error",
              variant: "danger",
            });
          }
        });
    },
  },
};
</script>

<style scoped>
.accessListContainer {
  display: flex;
  flex-direction: column;
}
.accessListItem {
  min-height: 50px;
}
div.modal-content div.tooltip div.tooltip-inner {
  max-width: 20rem;
}
</style>
