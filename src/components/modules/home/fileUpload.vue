<template>
  <div class="my-4 w-100 h-100 d-flex flex-column align-items-center">
    <div class="w-75 my-2 p-3 shadow">
      <b-tabs content-class="mt-3" active-nav-item-class="font-weight-bold text-primary" fill>
        <b-tab title="Folder Upload" active>
          <div class="d-flex text-center">
            <div class="w-50 p-3 m-3 shadow">
              <b-form-group
                id="multiFiles-input-group"
                label="Upload Images"
                label-for="multiFiles-input"
                :label-class="'text-center font-weight-bold'"
                description="Accepted formats: .jpeg,.png"
              >
                <b-form-file
                  class="dz-hidden-input"
                  id="multiFiles-input"
                  v-model="form.multiFiles"
                  directory
                  multiple
                  accept=".jpeg, .png,"
                  plain
                  @input="filesSelected"
                ></b-form-file>
              </b-form-group>
            </div>
            <div class="w-50 p-3 m-3 shadow">
              <b-form-group
                id="orthomosaic-input-group"
                label="Upload Orthomosaic"
                label-for="orthomosaic-input"
                :label-class="'text-center font-weight-bold'"
                description="Accepted format: .tif"
              >
                <b-form-file
                  id="orthomosaic-input"
                  v-model="form.orthomosaic"
                  :state="Boolean(form.orthomosaic)"
                  accept=".tif"
                  plain
                  required
                  :disabled="isFlowUploading"
                  @input="orthoSelected"
                ></b-form-file>
              </b-form-group>
            </div>
          </div>

          <b-table
            borderless
            hover
            head-variant="light"
            :fields="fields"
            :items="filesArray"
            :empty-text="`Select a file or folder`"
            responsive="sm"
            show-empty
          >
            <template #cell(index)="data">
              {{ data.index + 1 }}
            </template>
            <template #cell(size)="data">
              {{ data.value | fileSizer() }}
            </template>
            <template #cell(progress)="data">
              <div :id="data.item.uniqueIdentifier"></div>
            </template>
            <template #cell(completed)="data">
              <div
                :id="data.item.uniqueIdentifier + 'isComplete'"
                class="text-center"
              >
                <b-spinner variant="primary" label="Uploading"></b-spinner>
              </div>
            </template>
            <!-- <template #cell(actions)="data">
              <div class="d-flex">
                <div v-if="data.item.paused">
                  <b-button
                    :disabled="data.item.isComplete()"
                    variant="outline-primary"
                    class="fileActionButton mx-1"
                    @click="data.item.resume()"
                    ><i class="fa fa-play-circle" aria-hidden="true"></i
                  ></b-button>
                </div>
                <div v-else>
                  <b-button
                    :disabled="data.item.isComplete()"
                    variant="outline-primary"
                    class="fileActionButton mx-1"
                    @click="data.item.pause()"
                    ><i class="fa fa-pause-circle" aria-hidden="true"></i
                  ></b-button>
                </div>
                <div>
                  <b-button
                    :disabled="data.item.isComplete()"
                    variant="outline-danger"
                    class="fileActionButton mx-1"
                    @click="data.item.cancel()"
                    ><i class="fa fa-times" aria-hidden="true"></i
                  ></b-button>
                </div>
              </div>
            </template> -->
          </b-table>
        </b-tab>

        <b-tab title="Additional File Upload" :disabled="isFlowUploading">
          <div class="d-flex justify-content-center">
            <div class="p-3 mx-3 shadow">
              <b-form-group
                id="addCad-input-group"
                label="Upload CAD"
                label-for="addCad-input"
                :label-class="'text-center font-weight-bold'"
                description="Accepted formats: .dwg,.dxl"
              >
                <b-form-file
                  id="addCad-input"
                  v-model="additional.cad"
                  accept=".dwg,.dxl"
                  @input="AdditionalFileSelected"
                ></b-form-file>
              </b-form-group>
              <div class="text-center">
                <b-button class="primaryBg">Submit</b-button>
              </div>
            </div>
            <div class="p-3 mx-3 shadow">
              <b-form-group
                id="addPc-input-group"
                label="Upload Point Cloud"
                label-for="addPc-input"
                description="Accepted formats: .las,.xyz"
                :label-class="'text-center font-weight-bold'"
              >
                <b-form-file
                  id="addPc-input"
                  v-model="additional.pc"
                  accept=".las,.xyz"
                  @input="AdditionalFileSelected"
                ></b-form-file>
              </b-form-group>
              <div class="text-center">
                <b-button class="primaryBg">Submit</b-button>
              </div>
            </div>
            <div class="p-3 mx-3 shadow">
              <b-form-group
                id="addGpc-input-group"
                label="Upload GPC"
                label-for="addGpc-input"
                :label-class="'text-center font-weight-bold'"
                description="Accepted formats: .xls,.csv"
              >
                <b-form-file
                  id="addGpc-input"
                  v-model="additional.gpc"
                  accept=".xls,.csv"
                  @input="AdditionalFileSelected"
                ></b-form-file>
              </b-form-group>
              <div class="text-center">
                <b-button class="primaryBg">Submit</b-button>
              </div>
            </div>
          </div>
        </b-tab>
      </b-tabs>
      <div v-if="this.isFlowUploading" class="text-center">
        <div v-if="this.isPaused">
          <b-button class="primaryBg" @click="resumeUpload()">Resume</b-button>
        </div>
        <div v-else>
          <b-button class="primaryBg" @click="pauseUpload()">Pause</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { httpClient } from "@/services/backendService/httpClient";
import { TokenService } from "@/services/tokenService/tokenService.js";
import Flow from "@flowjs/flow.js";
import dayjs from 'dayjs';
export default {
  name: "fileUpload",
  data() {
    return {
      flow: null,
      isFlowUploading: false,
      isPaused: false,
      form: {
        multiFiles: [],
        orthomosaic: null,
      },
      additional: { cad: null, pc: null, gpc: null },
      fields: [
        // A virtual column
        "index",
        "name",
        { key: "name", label: "File Name" },
        "size",
        "relativePath",
        "progress",
        "completed",
        // A virtual column
        // "actions",
      ],
      date: dayjs(new Date()).format('YYYY-MM-DD'),
    };
  },
  computed: {
    filesArray: function() {
      let filesArray = this.flow ? this.flow.files : [];
      return filesArray;
    },
    projectId: function() {
      let projectId = this.$route.params.projectId;
      return projectId;
    },
  },
  methods: {
    initiateFlow() {
      this.flow.upload();

      //handle network glitches
      window.addEventListener("offline", (event) => {
        this.$root.$emit("showToast", {
          title: "Upload paused!",
          message:
            "You lost connection. Upload will resume when network connection is established",
          variant: "danger",
        });

        console.log(event, "You lost connection.");
        this.flow.pause();
      });
      window.addEventListener("online", (event) => {
        console.log(event, "You are now back online.");
        this.$root.$emit("showToast", {
          title: "Upload resumed!",
          message: "File uploading has been resumed",
          variant: "success",
        });
        this.flow.resume();
      });
    },
    filesSelected() {
      let selectedFiles = this.form.multiFiles;
      let checkApiPostData = [];
      selectedFiles.forEach((file) => {
        checkApiPostData.push({
          path: file.webkitRelativePath,
          file: file.name,
          size: file.size,
        });
      });
      this.checkAlreadyUploaded(checkApiPostData);
    },
    checkAlreadyUploaded(checkApiPostData) {
      httpClient
        .post(`upload/check/${this.projectId}/${this.date}/`, checkApiPostData)
        .then((response) => {
          if (response.data) {
            let checkApiResponse = response.data;
            let existingFilePaths = checkApiResponse
              .filter((checkedFile) => checkedFile.status === false)
              .map((existingFile) => existingFile.file);

            let selectedFiles = this.form.multiFiles;
            let storeApiPostData = {};

            if (existingFilePaths.length > 0) {
              if (existingFilePaths.length === selectedFiles.length) {
                //all files already exists
                this.$root.$emit("showToast", {
                  title: "Files already uploaded!",
                  message:
                    "All the selected files are already uploaded to the server",
                  variant: "info",
                });
              } else {
                //Atleast some files exists already
                let numOfFiles = 0;
                selectedFiles.forEach((selectedFile) => {
                  if (
                    !existingFilePaths.includes(selectedFile.webkitRelativePath)
                  ) {
                    this.flow.addFile(selectedFile);
                    storeApiPostData[selectedFile.webkitRelativePath] =
                      selectedFile.name;
                    numOfFiles++;
                  }
                });
                this.callStoreApi(storeApiPostData, numOfFiles);
                this.flow.upload();
              }
            } else if (existingFilePaths.length === 0) {
              //all files are to be uploaded
              selectedFiles.forEach((selectedFile) => {
                this.flow.addFile(selectedFile);
                storeApiPostData[selectedFile.webkitRelativePath] =
                  selectedFile.name;
              });

              this.callStoreApi(storeApiPostData, selectedFiles.length);
              this.flow.upload();
            }
          }
        });
    },
    callStoreApi(storeApiPostData, numOfFiles) {
      let storeApiData = {
        proj: `${this.projectId}`,
        total: numOfFiles,
        allfiles: storeApiPostData,
      };
      httpClient.post(`upload/store/${this.projectId}/${this.date}/`, storeApiData);
      this.isFlowUploading = true;
      this.$root.$emit("showToast", {
        title: "Upload Initiated!",
        message: "All the selected files are being uploaded to the server",
        variant: "success",
      });
    },
    orthoSelected(file) {
      this.flow.addFile(file);
      console.log(file);
    },
    AdditionalFileSelected(file) {
      let formData = new FormData();
      formData.append("File", file);
      httpClient
        .post(
          `http://takvaviya.in:8001/Asset/upload/singlefileupload/${this.projectId}/${this.date}/`,
          formData
        )
        .then((response) => {
          console.log(response);
        });
    },
    resumeUpload() {
      this.flow.resume();
      this.isPaused = false;
      this.$root.$emit("showToast", {
        title: "Upload Resumed!",
        message: "File uploading has resumed",
        variant: "success",
      });
    },
    pauseUpload() {
      this.flow.pause();
      this.isPaused = true;
      this.$root.$emit("showToast", {
        title: "Upload Paused!",
        message: "Click resume to resume file upload",
        variant: "info",
      });
    },
    sendEmail(status) {
      httpClient.post(
        `http://takvaviya.in:8001/Asset/upload/email/${this.projectId}/`,
        status
      );
    },
  },
  mounted() {
    this.flow = new Flow({
      target: `http://takvaviya.in:8001/Asset/upload/flow/${this.projectId}/${this.date}/`,
      testChunks: false,
      permanentErrors: [404, 500, 501],
      maxChunkRetries: 3,
      chunkRetryInterval: 5000,
      simultaneousUploads: 1,
      chunkSize: 20000000,
      headers: {
        Authorization: `Token ${TokenService.getToken()}`
      },
    });

    this.flow.on("uploadStart", () => {
      this.sendEmail({ status: "Initiated" });
    });
    this.flow.on("fileProgress", (file) => {
      let progressContainer = document.getElementById(file.uniqueIdentifier);
      progressContainer.innerHTML = `${file.progress() * 100} %`;
    });
    // eslint-disable-next-line no-unused-vars
    this.flow.on("fileSuccess", (file, message) => {
      let isCompleteContainer = document.getElementById(
        `${file.uniqueIdentifier}isComplete`
      );
      isCompleteContainer.innerHTML = ` <i class="fa fa-check text-success" aria-hidden="true"></i>`;
    });
    this.flow.on("complete", () => { //TODO handle at least one success and other error
      this.isFlowUploading = false;
      this.sendEmail({ status: "Success" });
      this.$root.$emit("showToast", {
        title: "Files uploaded!",
        message:
          "All the selected files are uploaded successfully to the server",
        variant: "success",
      });
    });
  },
};
</script>

<style scoped>
.additionalFilesContainer {
  display: flex;
  flex-flow: column;
}
label {
  text-align: center !important;
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
.btn.disabled,
.btn:disabled {
  cursor: not-allowed;
}
</style>
