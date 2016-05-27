import { GRAPHQL } from '../mutation-types'

const state = {}

const mutations = {
  [GRAPHQL] (state, storeState, socket, schema, query) {
    socket.once('graphql.result', function (result) {
      storeState.serverData = result
    })
    socket.emit('graphql', { schema, query })
  }
}

export default {
  state,
  mutations
}
