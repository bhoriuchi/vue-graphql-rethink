import _ from 'lodash'
import { SchemaLib } from '../graphql'
import { graphResult } from '../graphql/utils/graphql'

export function sockets (io) {
  io.on('connection', function (socket) {
    socket.on('graphql.query', function (payload) {
      if (_.has(SchemaLib, payload.schema)) {
        SchemaLib[payload.schema](payload.query).then(function (result) {
          socket.emit('graphql.result', graphResult(result))
        })
      } else {
        console.log(SchemaLib)
        socket.emit('graphql.result', { errors: ['Schema does not exist'] })
      }
    })
  })
}
