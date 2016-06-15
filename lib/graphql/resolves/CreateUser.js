import { createVersionedRecord as create } from '../utils/db'

export default function CreateUser (obj, args, source, fieldASTs) {
  let cursor = this.globals.db.main.cursor
  let objType = this.globals.db.main.tables.User
  let changeLog = args.changeLog || {user: 'SYSTEM', message: 'CREATED RECORD'}
  this.utils.merge(changeLog, {date: new Date(), type: 'CREATE'})
  return create(cursor, objType, {
    _metadata: {
      version: null,
      validFrom: null,
      validTo: null,
      changeLog: [changeLog]
    },
    id: cursor.uuid(),
    firstName: args.firstName,
    lastName: args.lastName,
    email: args.email,
    useCurrent: args.useCurrent
  })
}
