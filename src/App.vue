<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import store from './vuex/store'
  export default {
    store,
    sockets: {
      connect () {
        console.log('connected to socket.io')
      }
    },
    components: {
    }
  }
</script>

<style>
html {
  height: 100%;
}
</style>
