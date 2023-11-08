# Soramitsu Sr-Socket Module

The official Soramitsu Khmer's Sr-Socket Module build on top of Websocket for use with Vue3

#### 🚀 Installation
``` bash
yarn add sr-socket
```

## Usage

Register `VueWebSocket` plugin in your `src/main.js`.

```js
// src/main.js 

import { createApp } from "vue";
import App from "./App.vue";
import { VueWebSocket } from 'sr-socket'

const app = createApp(App);

app.use(VueWebSocket);
app.mount("#app");

```

Then we can access by this.$soraSocket like below example.

```vue
<template>
  <div>
    <v-text-field type="text" v-model="message"></v-text-field>
    <v-btn @click="unsubscribe('chat')"> unsubscribe channel Chat </v-btn>
    <v-btn @click="unsubscribe('one')"> unsubscribe channel One </v-btn>
    <v-btn @click="onChatToServer('chat')">Chat Channel</v-btn>
    <v-btn @click="onChatToServer('one')">One Channel</v-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeView",
  components: {
  },
  mounted() {

    const chatChannel = 'ws://localhost:8082/chat'
    const oneChannel = 'ws://localhost:8082/one'

    const chatChannelParam = {
      url: chatChannel,
      callBack: (msgEvent) => {
              console.log('>>>>call Back subscribe channel Chat: ', msgEvent)
            },
      onDisconnected: (reason) => {
              console.log('>>>Channel Chat Disconnected....', reason)
            },
      configRetryConnection: {
        reconnectAttempt: 10,
        durationReconnect: 5000
      }
    }

    const oneChannelParam = {
      url: oneChannel,
      callBack: (msgEvent) => {
              console.log('>>>>call Back subscribe channel One: ', msgEvent)
            },
      onDisconnected: (reason) => {
              console.log('>>>Channel One Disconnected....', reason)
            }
    }

    this.channelChat = this.$soraSocket.subscribe(chatChannelParam)
    
    this.channelOne = this.$soraSocket.subscribe(oneChannelParam)
    
  },
  methods: {
    onChatToServer(channel) {
        if (channel === 'chat') {
          this.$soraSocket.onSend(this.channelChat, {message: this.message})
        }
        if (channel === 'one') {
          this.$soraSocket.onSend(this.channelOne, {message: this.message})
        }
    },
    
    unsubscribe(channel) {
      if (channel === 'chat') {
        this.$soraSocket.unsubscribe(this.channelChat, (msg) => {
          console.log(msg)
        })
      }
      if (channel === 'one') {
        this.$soraSocket.unsubscribe(this.channelOne, (msg) => {
          console.log(msg)
        })
      }
     
    }
  },
  data() {
    return {
      channelChat: null,
      channelOne: null,
      message: '',
    };
  },
});
</script>
```