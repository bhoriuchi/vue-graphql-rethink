import graphResult from './graphql'
import db from './db'

const DEFAULT_VERSION = '0.1.0'

export default Object.assign(
  graphResult,
  db
)

