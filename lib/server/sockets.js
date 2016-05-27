import _ from 'lodash'
import { schemas } from '../graphql'
import { graphql } from 'graphql'

export function sockets (io) {
  io.on('connection', function (socket) {
    socket.on('graphql', function (payload) {
      if (_.has(schemas, payload.schema)) {
        graphql(schemas[payload.schema], payload.query).then(function (result) {
          socket.emit('graphql.result', result)
        })
      } else {
        socket.emit('graphql.result', {})
      }
    })
  })
}
