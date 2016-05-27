import { GRAPHQL, SET_SERVER_DATA } from '../mutation-types'

const state = {}

const mutations = {
  [GRAPHQL] (state, storeState, socket, schema, query) {
    socket.once('graphql.result', function (result) {
      storeState.serverData = result
    })
    socket.emit('graphql', { schema, query })
  },
  [SET_SERVER_DATA] (state, store, data) {
    store.state.serverData = data
  }
}

export default {
  state,
  mutations
}
