import * as types from './mutation-types'

export const graphql = ({ dispatch, state }, socket, schema, query) => {
  socket.once('graphql.result', function (result) {
    dispatch(types.GRAPHQL, state, result)
  })
  socket.emit('graphql.query', { schema, query })
}
