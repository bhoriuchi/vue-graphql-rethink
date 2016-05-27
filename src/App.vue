<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  sockets: {
    connect () {
      console.log('connected')
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
