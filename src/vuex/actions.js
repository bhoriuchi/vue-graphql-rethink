import * as types from './mutation-types'

export const graphql = ({ dispatch }, socket, query) => {
  dispatch(types.GRAPHQL, socket, query)
}
