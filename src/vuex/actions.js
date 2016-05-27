import * as types from './mutation-types'

export const graphql = ({ dispatch, state }, socket, schema, query) => {
  dispatch(types.GRAPHQL, state, socket, schema, query)
}
