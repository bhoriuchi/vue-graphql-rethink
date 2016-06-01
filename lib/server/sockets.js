import _ from 'lodash'
import { schemas } from '../graphql'
import { graphResult } from './utils'
import { graphql } from 'graphql'

export function sockets (io) {
  io.on('connection', function (socket) {
    socket.on('graphql.query', function (payload) {
      if (_.has(schemas, payload.schema)) {
        graphql(schemas[payload.schema], payload.query).then(function (result) {
          socket.emit('graphql.result', graphResult(result))
        })
      } else {
        socket.emit('graphql.result', { errors: ['Schema does not exist'] })
      }
    })
  })
}
