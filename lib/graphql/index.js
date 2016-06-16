import schemas from './schemas'
import types from './types'
import utils from './utils'
import fields from './partials'
import functions from './resolves'
import externalTypes from './externalTypes'

import { main } from '../db'
import { getDBConfig } from './utils/db'

import * as graphql from 'graphql'
import GraphQLFactory from 'graphql-factory'

let factory = GraphQLFactory(graphql)

let SchemaLib = factory.make({
  functions,
  fields,
  types,
  schemas,
  externalTypes,
  globals: {
    db: { main },
    getDBConfig
  }
})

export { SchemaLib }
export { utils }

export default {
  SchemaLib,
  utils
}
