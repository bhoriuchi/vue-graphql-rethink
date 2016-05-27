import user from './user'
import status from './status'

const Types = {
  user: {
    obj: user,
    table: 'user',
    db: 'test'
  },
  status: {
    obj: status,
    table: null,
    db: null
  }
}

module.exports = Types
