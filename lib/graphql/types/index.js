import _status from './_status'
import _version from './_version'
import user from './user'

const Types = {
  _status: { obj: _status },
  _version: { obj: _version },
  user: { obj: user, table: 'user', db: 'test' }
}

module.exports = Types
