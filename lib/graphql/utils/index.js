import graphResult from './graphql'
import db from './db'

const DEFAULT_VERSION = '0.1.0'
const USE_CURRENT_TABLE = 'use_current'
const USE_CURRENT_FIELD = 'useCurrent'

export default Object.assign(
  graphResult,
  db
)

