import schemas from './schemas'
import types from './types'
import utils from './utils'
import * as graphql from 'graphql'
import { main } from '../db'
import CustomGraphQLDateType from 'graphql-custom-datetype'
import GraphQLFactory from 'graphql-factory'
import { MutationFieldsVersion } from './partials'
import { CreateUser, GetRecords } from './resolves'

let factory = GraphQLFactory(graphql)

let SchemaLib = factory.make({
  globals: {
    db: {
      main
    }
  },
  functions: {
    CreateUser,
    GetRecords
  },
  fields: {
    MutationFieldsVersion
  },
  externalTypes: {
    DateTime: CustomGraphQLDateType
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
