// core
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueSocketio from 'vue-socket.io'

// vuex
import { sync } from 'vuex-router-sync'
import store from './vuex/store'

// vendor
import 'bootstrap/dist/css/bootstrap.min.css'

// components
import Forms from './components/Forms'
import Hello from './components/Hello'

Vue.config.debug = true
Vue.use(VueRouter)
Vue.use(VueSocketio, 'http://localhost:8080')

let router = new VueRouter()
sync(store, router)

store.watch(function (oldVal, newVal) {
  console.log(oldVal, newVal)
})

router.map({
  '/': {
    component: Hello
  },
  '/forms': {
    component: Forms
  }
})

router.start(App, 'app')
