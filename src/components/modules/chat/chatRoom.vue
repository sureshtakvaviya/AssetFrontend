<template>
  <div>
    <div v-if="isChatVisible" class="chat is-visible" style="z-index: 999;">
      <div class="chat_header">
        <div class="chat_option">
          <span class="mx-2 text-light" id="chat_head">Messages</span>
          <div class="mt-1 mr-2">
            <i class="fa fa-users fa-2x"></i>
            <b-badge id="activeCount" pill variant="success">3</b-badge>
            <span
              @click="isChatVisible = !isChatVisible"
              id="hideChatButton"
              class="mx-1"
              ><i class="fa fa-angle-down text-light"></i
            ></span>
          </div>
        </div>
      </div>
      <div
        id="chat_fullscreen"
        class="chat_conversion chat_converse"
        style="display: block;"
      >
        <div
          id="messagesList"
          v-for="(message, index) in messages"
          :key="index"
        >
          <div
            v-if="message.handle === handle"
            class="chat_msg_item chat_msg_item_user"
          >
            <span class="chatMessage">{{ message.message }}</span>
            <span class="chatTimeStamp">{{ message.timestamp }}</span>
          </div>
          <div v-else class="chat_msg_item chat_msg_item_admin">
            <div class="chat_avatar">
              <img :src="userProfilePic" />
            </div>
            <span class="chatHandle"
              ><i class="fa fa-circle text-success mx-1"></i
              >{{ message.handle }}</span
            >
            <span class="chatMessage">{{ message.message }}</span>
            <span class="chatTimeStamp">{{ message.timestamp }}</span>
          </div>
        </div>
      </div>
      <div class="fab_field">
        <a id="fab_camera" class="fab is-visible"
          ><i class="fa fa-camera"></i
        ></a>
        <a id="fab_send" class="fab is-visible" @click="send"
          ><i class="fa fa-paper-plane"></i
        ></a>
        <textarea
          v-model="newMessage"
          id="chatSend"
          name="chat_message"
          placeholder="Send a message"
          class="chat_field chat_message"
          @keydown.shift.enter.prevent="send"
          @click="clearAutoHideTimer"
        ></textarea>
      </div>
    </div>
    <div
      v-else
      class="chatMinimized d-flex align-items-center primaryBg text-light rounded"
    >
      <div
        class="d-flex justify-content-between align-items-center w-100"
        @click="isChatVisible = !isChatVisible"
      >
        <div
          class="ml-2 d-flex justify-content-between align-items-center w-50"
        >
          <div><i class="fas fa-envelope"></i></div>
          <div>Messages</div>
        </div>
        <div class="mr-2">
          <i class="fas fa-angle-up"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "chatBox",
  data() {
    return {
      isChatVisible: true,
      chatsock: null,
      newMessage: "",
      autoHideTimer: null,
    };
  },
  computed: {
    messages: function() {
      return this.$store.state.chatStore.chatMessages;
    },
    userDetails: function() {
      let userDetails = this.$store.getters["userStore/getLoggedInUserDetails"];
      return userDetails ? userDetails : {};
    },
    handle: function() {
      let username = this.userDetails.username;
      return username ? username : "user";
    },
    userProfilePic: function() {
      let userProfilePic = `url(${require("@/assets/img/male-default-icon.png")})`;
      if (this.userDetails.profile_picture) {
        userProfilePic = this.userDetails.profile_picture
      }
      return userProfilePic;
    },
    //TODO change to actual pic
    randomProfilePic: function() {
      return `https://randomuser.me/api/portraits/men/${this.userId + 10}.jpg`;
    },
  },
  methods: {
    send() {
      var message = {
        handle: this.handle,
        message: this.newMessage,
      };
      this.$store.dispatch("chatStore/sendNewMessage", message);
      this.newMessage = "";
    },
    clearAutoHideTimer() {
      if (this.autoHideTimer) clearTimeout(this.autoHideTimer);
    },
  },
  mounted() {
    //Chat Socket Init
    let connectionData = {
      wsRoot: "wss://morning-coast-23117.herokuapp.com",
      roomName: "green-smoke-2521",
    };
    this.$store.dispatch("chatStore/initChat", connectionData);

    //Getting previous messages
    this.$store.dispatch("chatStore/getOldMessagesApi", "green-smoke-2521");
    this.autoHideTimer = setTimeout(() => {
      //after 5s minimize the chatroom
      this.isChatVisible = false;
    }, 5000);
  },
  destroyed() {
    this.$store.dispatch("chatStore/disconnectSocket");
  },
};
</script>

<style scoped>
/* @import url(
  https://fonts.googleapis.com/css?family=Roboto:400,
  100,
  100italic,
  300,
  300italic,
  400italic,
  500,
  500italic,
  700,
  700italic,
  900,
  900italic&subset=latin,
  cyrillic
); */
@import url(https://zavoloklom.github.io/material-design-iconic-font/css/docs.md-iconic-font.min.css);
ul li {
  list-style: none;
}

.fabs {
  bottom: 0;
  position: fixed;
  margin: 1em;
  right: 0;
  z-index: 998;
}

.fab {
  display: block;
  /* bottom: 20px; */
  width: 56px;
  height: 56px;
  border-radius: 50%;
  text-align: center;
  color: var(--light);
  margin: 25px auto 0;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);
  cursor: pointer;
  -webkit-transition: all 0.1s ease-out;
  transition: all 0.1s ease-out;
  position: relative;
  z-index: 998;
  overflow: hidden;
  background: var(--primaryBg);
}

.fab > i {
  font-size: 2em;
  line-height: 55px;
  -webkit-transition: all 0.2s ease-out;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.fab:not(:last-child) {
  width: 0;
  height: 0;
  margin: 20px auto 0;
  opacity: 0;
  visibility: hidden;
  line-height: 40px;
}

.fab:not(:last-child) > i {
  font-size: 1.4em;
  line-height: 40px;
}

.fab:not(:last-child).is-visible {
  width: 40px;
  height: 40px;
  margin: 15px auto 10;
  opacity: 1;
  visibility: visible;
}

.fab:nth-last-child(1) {
  -webkit-transition-delay: 25ms;
  transition-delay: 25ms;
}

.fab:not(:last-child):nth-last-child(2) {
  -webkit-transition-delay: 20ms;
  transition-delay: 20ms;
}

.fab:not(:last-child):nth-last-child(3) {
  -webkit-transition-delay: 40ms;
  transition-delay: 40ms;
}

.fab:not(:last-child):nth-last-child(4) {
  -webkit-transition-delay: 60ms;
  transition-delay: 60ms;
}

.fab:not(:last-child):nth-last-child(5) {
  -webkit-transition-delay: 80ms;
  transition-delay: 80ms;
}

.fab:last-child:active,
.fab:last-child:focus,
.fab:last-child:hover {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.16), 0 6px 12px rgba(0, 0, 0, 0.32);
}

/*Chatbox*/

.chat {
  position: fixed;
  right: 150px;
  bottom: 20px;
  width: 400px;
  font-size: 12px;
  line-height: 22px;
  font-family: "Roboto";
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  opacity: 0;
  box-shadow: 1px 1px 100px 2px rgba(0, 0, 0, 0.22);
  border-radius: 10px;
  -webkit-transition: all 0.2s ease-out;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  background-color: var(--primaryBg);
}
.chatMinimized {
  position: fixed;
  right: 10em;
  bottom: 1.6em;
  z-index: 999;
  cursor: pointer;
  height: 2.5rem;
  width: 12rem;
}
.chat_fullscreen {
  position: fixed;
  right: 0px;
  bottom: 0px;
  top: 0px;
}

.chat_header {
  /* margin: 10px; */
  font-size: 13px;
  font-family: "Roboto";
  font-weight: 500;
  color: var(--light);
  height: 55px;
  background-color: var(--primaryBg);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding-top: 8px;
}
#chat_head {
  font-size: 1.5rem;
}
.chatHandle {
  display: block;
  font-weight: bold;
}
.chatMessage {
  display: block;
}
.chatTimeStamp {
  display: block;
  font-size: 0.8em;
  font-weight: lighter;
}
span.chatHandle i {
  font-size: smaller;
}
.chat_header2 {
  /* margin: 10px; */
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

.chat_header .span {
  float: right;
}

.chat_fullscreen_loader {
  display: none;
  float: right;
  cursor: pointer;
  /* margin: 10px; */
  font-size: 20px;
  opacity: 0.5;
  /* padding: 20px; */
  margin: -10px 10px;
}

.chat.is-visible {
  opacity: 1;
  -webkit-animation: zoomIn 0.2s cubic-bezier(0.42, 0, 0.58, 1);
  animation: zoomIn 0.2s cubic-bezier(0.42, 0, 0.58, 1);
}

.is-hide {
  opacity: 0;
}

.chat_option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  list-style: none;
  position: relative;
  height: 100%;
  width: 100%;
  margin-right: 10px;
  letter-spacing: 0.5px;
  font-weight: 400;
  background-color: var(--primaryBg);
}

.chat_option img {
  border-radius: 50%;
  width: 55px;
  float: left;
  margin: -30px 20px 10px 20px;
  border: 4px solid rgba(0, 0, 0, 0.21);
}

.change_img img {
  width: 35px;
  margin: 0px 20px 0px 20px;
}

.chat_option .agent {
  font-size: 12px;
  font-weight: 300;
}

.chat_option .online {
  /*opacity: 0.4;*/
  color: var(--online);
  font-size: 11px;
  font-weight: 500;
}

.chat_color {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 10px;
  float: left;
}
#activeCount {
  position: relative;
  bottom: 20px;
  right: 10px;
}
#hideChatButton {
  position: relative;
  bottom: 10px;
  cursor: pointer;
}
.chat_body {
  background: var(--light);
  width: 100%;
  display: inline-block;
  text-align: center;
  overflow-y: auto;
}

#chat_body {
  height: 450px;
}

.chat_login p,
.chat_body li,
p,
a {
  -webkit-animation: zoomIn 0.5s cubic-bezier(0.42, 0, 0.58, 1);
  animation: zoomIn 0.5s cubic-bezier(0.42, 0, 0.58, 1);
}

.chat_body p {
  padding: 20px;
  color: var(--grey);
}

.chat_body a {
  width: 10%;
  text-align: center;
  border: none;
  box-shadow: none;
  line-height: 40px;
  font-size: 15px;
}

.chat_field {
  position: relative;
  margin: 5px 0 5px 0;
  width: 50%;
  font-family: "Roboto";
  font-size: 12px;
  font-weight: 500;
  color: var(--grey);
  -webkit-font-smoothing: antialiased;
  border: none;
  outline: none;
  display: inline-block;
}

.chat_field.chat_message {
  height: 30px;
  resize: none;
  font-size: 13px;
  font-weight: 400;
}

.chat_category {
  text-align: left;
}

.chat_category {
  margin: 20px;
  background: rgba(0, 0, 0, 0.03);
  padding: 10px;
}

.chat_category ul li {
  width: 80%;
  height: 30px;
  background: var(--light);
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  border-radius: 3px;
  border: 1px solid var(--grey);
  font-size: 13px;
  cursor: pointer;
  line-height: 30px;
  color: var(--grey);
  text-align: center;
}

.chat_category li:hover {
  background: #83c76d;
  color: var(--light);
}

.chat_category li.active {
  background: #83c76d;
  color: var(--light);
}

.fab_field {
  width: 100%;
  display: inline-block;
  text-align: center;
  background: var(--light);
  border-top: 1px solid var(--light);
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}

.fab_field2 {
  bottom: 0px;
  position: absolute;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  z-index: 999;
}

.fab_field a {
  display: inline-block;
  text-align: center;
}

#fab_camera {
  float: left;
  background: rgba(0, 0, 0, 0);
}

#fab_send {
  float: right;
  background: rgba(0, 0, 0, 0);
}

.fab_field .fab {
  width: 35px;
  height: 35px;
  box-shadow: none;
  margin: 5px;
}

.fab_field .fab > i {
  font-size: 1.6em;
  line-height: 35px;
  color: var(--dark-grey);
}

.fab_field .fab > i:hover {
  color: #42a5f5;
}

.chat_converse {
  position: relative;
  background: var(--light);
  margin: 6px 0 0px 0;
  height: 300px;
  min-height: 0;
  font-size: 12px;
  line-height: 18px;
  overflow-y: auto;
  width: 100%;
  float: right;
  padding-bottom: 100px;
}

.chat_converse2 {
  height: 100%;
  max-height: 800px;
}

.chat_list {
  opacity: 0;
  visibility: hidden;
  height: 0;
}

.chat_list .chat_list_item {
  opacity: 0;
  visibility: hidden;
}

.chat .chat_converse .chat_msg_item {
  position: relative;
  margin: 8px 0 15px 0;
  padding: 8px 10px;
  max-width: 60%;
  display: block;
  word-wrap: break-word;
  border-radius: 3px;
  -webkit-animation: zoomIn 0.5s cubic-bezier(0.42, 0, 0.58, 1);
  animation: zoomIn 0.5s cubic-bezier(0.42, 0, 0.58, 1);
  clear: both;
  z-index: 999;
}

.status {
  margin: 45px -50px 0 0;
  float: right;
  font-size: 11px;
  opacity: 0.3;
}

.status2 {
  margin: -10px 20px 0 0;
  float: right;
  display: block;
  font-size: 11px;
  opacity: 0.3;
}

.chat .chat_converse .chat_msg_item .chat_avatar {
  position: absolute;
  top: 0;
}

.chat .chat_converse .chat_msg_item.chat_msg_item_admin .chat_avatar {
  left: -52px;
  background: rgba(0, 0, 0, 0.03);
}

.chat .chat_converse .chat_msg_item.chat_msg_item_user .chat_avatar {
  right: -52px;
  background-color: var(--primaryBg);
}

.chat .chat_converse .chat_msg_item .chat_avatar,
.chat_avatar img {
  width: 40px;
  height: 40px;
  text-align: center;
  border-radius: 50%;
}

.chat .chat_converse .chat_msg_item.chat_msg_item_admin {
  margin-left: 60px;
  float: left;
  background: rgba(0, 0, 0, 0.03);
  color: var(--dark-grey);
}

.chat .chat_converse .chat_msg_item.chat_msg_item_user {
  margin-right: 20px;
  float: right;
  background-color: var(--primaryBg);
  color: var(--light);
}

.chat .chat_converse .chat_msg_item.chat_msg_item_admin:before {
  content: "";
  position: absolute;
  top: 15px;
  left: -12px;
  z-index: 998;
  border: 6px solid transparent;
  border-right-color: var(--dark-grey);
}

/*Chatbox scrollbar*/

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  border-radius: 0;
}

::-webkit-scrollbar-thumb {
  margin: 2px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
}

/*Element state*/

.is-active {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
  -webkit-transition: all 1s ease-in-out;
  transition: all 1s ease-in-out;
}

.is-float {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.16), 0 6px 12px rgba(0, 0, 0, 0.32);
}

.is-loading {
  display: block;
  -webkit-animation: load 1s cubic-bezier(0, 0.99, 1, 0.6) infinite;
  animation: load 1s cubic-bezier(0, 0.99, 1, 0.6) infinite;
}

/*Animation*/

@-webkit-keyframes zoomIn {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes zoomIn {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }
}

@-webkit-keyframes load {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
  }
  50% {
    -webkit-transform: scale(1.5);
    transform: scale(1.5);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes load {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
  }
  50% {
    -webkit-transform: scale(1.5);
    transform: scale(1.5);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}

/* SMARTPHONES PORTRAIT */

@media only screen and (min-width: 300px) {
  .chat {
    width: 250px;
  }
}

/* SMARTPHONES LANDSCAPE */

@media only screen and (min-width: 480px) {
  .chat {
    width: 300px;
  }
  .chat_field {
    width: 65%;
  }
}

/* TABLETS PORTRAIT */

@media only screen and (min-width: 768px) {
  .chat {
    width: 300px;
  }
  .chat_field {
    width: 65%;
  }
}

/* TABLET LANDSCAPE / DESKTOP */

@media only screen and (min-width: 1024px) {
  .chat {
    width: 300px;
  }
  .chat_field {
    width: 65%;
  }
}

/*Color Options*/

.blue .fab {
  background: #42a5f5;
  color: var(--light);
}

.blue .chat {
  background: #42a5f5;
  color: var(--dark-grey);
}

/* Ripple */

.ink {
  display: block;
  position: absolute;
  background: rgba(38, 50, 56, 0.4);
  border-radius: 100%;
  -moz-transform: scale(0);
  -ms-transform: scale(0);
  -webkit-transform: scale(0);
  transform: scale(0);
}

/*animation effect*/

.ink.animate {
  -webkit-animation: ripple 0.5s ease-in-out;
  animation: ripple 0.5s ease-in-out;
}

@-webkit-keyframes ripple {
  /*scale the element to 250% to safely cover the entire link and fade it out*/
  100% {
    opacity: 0;
    -moz-transform: scale(5);
    -ms-transform: scale(5);
    webkit-transform: scale(5);
    -webkit-transform: scale(5);
    transform: scale(5);
  }
}

@keyframes ripple {
  /*scale the element to 250% to safely cover the entire link and fade it out*/
  100% {
    opacity: 0;
    -moz-transform: scale(5);
    -ms-transform: scale(5);
    webkit-transform: scale(5);
    -webkit-transform: scale(5);
    transform: scale(5);
  }
}

::-webkit-input-placeholder {
  /* Chrome */
  color: var(--dark-grey);
}

:-ms-input-placeholder {
  /* IE 10+ */
  color: var(--dark-grey);
}

::-moz-placeholder {
  /* Firefox 19+ */
  color: var(--dark-grey);
}

:-moz-placeholder {
  /* Firefox 4 - 18 */
  color: var(--dark-grey);
}
</style>
