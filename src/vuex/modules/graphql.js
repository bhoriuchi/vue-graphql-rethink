import { GRAPHQL } from '../mutation-types'

const state = {
  whoami: null
}

const mutations = {
  [GRAPHQL] (state, socket, query) {
    socket.emit('graphql', query)
  }
}

export default {
  state,
  mutations
}
