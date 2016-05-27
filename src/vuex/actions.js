import * as types from './mutation-types'

export const graphql = ({ dispatch, state }, socket, schema, query) => {
  dispatch(types.GRAPHQL, state, socket, schema, query)
}

export const setServerData = ({ dispatch, state }, data) => {
  dispatch(types.SET_SERVER_DATA, state, data)
}
