import _ from 'lodash'
import { schemas } from '../graphql'
import { graphql } from 'graphql'

export function sockets (io) {
  io.on('connection', function (socket) {
    socket.on('graphql', function (payload) {
      let result = null
      if (_.has(schemas, payload.schema)) {
        result = graphql(schemas[payload.schema], payload.query)
      }
      socket.emit('graphql.result', result)
    })
  })
}
