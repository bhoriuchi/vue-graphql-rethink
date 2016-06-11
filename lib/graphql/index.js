import schemas from './schemas'
import types from './types'
import utils from './utils'
import * as graphql from 'graphql'
import { main } from '../db'
import CustomGraphQLDateType from 'graphql-custom-datetype'
import GraphQLFactory from 'graphql-factory'

let factory = GraphQLFactory(graphql)

factory.registerTypes({
  DateTime: CustomGraphQLDateType
})

let SchemaLib = factory.make({
  globals: {
    tables: main.tables
  },
  types: types,
  schemas: schemas
})

export { SchemaLib }
export { utils }

export default {
  SchemaLib,
  utils
}
