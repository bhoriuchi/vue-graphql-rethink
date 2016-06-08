import schemas from './schemas'
import types from './types'
import utils from './utils'
import * as graphql from 'graphql'
import CustomGraphQLDateType from 'graphql-custom-datetype'
import GraphQLFactory from 'graphql-factory'

let factory = GraphQLFactory(graphql)

factory.registerTypes({
  DateTime: CustomGraphQLDateType
})

let SchemaLib = factory.make({
  types: types,
  schemas: schemas
})

export {
  SchemaLib,
  utils
}
