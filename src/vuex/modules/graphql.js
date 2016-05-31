import { GRAPHQL } from '../mutation-types'

const state = {}

const mutations = {
  [GRAPHQL] (state, storeState, result) {
    storeState.serverData = result
  }
}

export default {
  state,
  mutations
}
