import schemas from './schemas'
import types from './types'
import utils from './utils'
import * as graphql from 'graphql'
import CustomGraphQLDateType from 'graphql-custom-datetype'
import factory from 'graphql-factory'

let f = factory(graphql)

f.registerTypes({
  DateTime: CustomGraphQLDateType
})

let SchemaLib = f.make({
  types: types,
  schemas: schemas
})

const GraphQL = {
  SchemaLib,
  utils
}

module.exports = GraphQL
