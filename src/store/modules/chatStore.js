// initial state
const state = () => ({
  chatSocket: null,
  chatMessages: [],
})
// getters
const getters = {
  getAllMessages(state) {
    if (state.chatMessages.length > 0) {
      return state.chatMessages
    }
    else {
      return [];
    }
  },
}
// actions
const actions = {
  //Establish Socket Connection and get current user
  initChat({ commit,state,dispatch }, connectionData) {
    // Chat WebSocket
    let chatSocket = new WebSocket(`${connectionData.wsRoot}/chat/${connectionData.roomName}`);
    if (chatSocket) {
      commit('setChatSocket', chatSocket)
      state.chatSocket.onmessage = function(message) {
        let data = JSON.parse(message.data);
        if(data)
        {
          dispatch('addNewMessage',data)
        }
      };
    }
  },

  //Get old Messages
  getOldMessagesApi({ commit }, roomName) {
    if (roomName) {
      fetch(`https://morning-coast-23117.herokuapp.com/api/message/?limit=50&label=${roomName}`)
        .then((response) => response.json())
        .then(jsonMessages => {
          if (jsonMessages) {
            commit('setOldMessages', jsonMessages)
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
  },

  sendNewMessage({state}, messageToSend) {
    if(messageToSend) {
      state.chatSocket.send(JSON.stringify(messageToSend))
    }
  },

  //add New Messages
  addNewMessage({ commit }, newMessage) {
    if (newMessage) {
      commit('setNewMessage', newMessage)
    }
  },

  //End Socket Connection
  disconnectSocket({state,commit})
  {
    if(state.chatSocket)
    {
      state.chatSocket.close()
      commit('setSocketNull')
      commit('setMessagesEmpty')
    }
  }
}

// mutations
const mutations = {
  setChatSocket(state, chatSocket) {
    state.chatSocket = chatSocket;
  },
  setOldMessages(state, oldMessages) {
    state.chatMessages = oldMessages;
  },
  setNewMessage(state, newMessage) {
    state.chatMessages.push(newMessage)
  },
  setSocketNull(state) {
    state.chatSocket = null;
  },
  setMessagesEmpty(state) {
    state.chatMessages = []
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}