/**
 * Created by bhoriuchi on 5/26/16.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import graphql from './modules/graphql'

Vue.use(Vuex)

const state = {}

export default new Vuex.Store({
  modules: {
    graphql
  },
  state
})
