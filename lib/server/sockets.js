import _ from 'lodash'
import { SchemaLib, utils } from '../graphql'
import { graphql } from 'graphql'

export function sockets (io) {
  io.on('connection', function (socket) {
    socket.on('graphql.query', function (payload) {
      if (_.has(SchemaLib, payload.schema)) {
        SchemaLib[payload.schema](payload.query).then(function (result) {
          socket.emit('graphql.result', utils.graphResult(result))
        })
      } else {
        socket.emit('graphql.result', { errors: ['Schema does not exist'] })
      }
    })
  })
}
