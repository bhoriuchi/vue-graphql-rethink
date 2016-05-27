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

// config
import Config from '../config/custom'

Vue.config.debug = true
Vue.use(VueRouter)
Vue.use(VueSocketio, Config.socket.server)

let router = new VueRouter()
sync(store, router)

/*
store.watch(function (val) {
  console.log(val)
})
*/

router.map({
  '/': {
    component: Hello
  },
  '/forms': {
    component: Forms
  }
})

router.start(App, 'app')
