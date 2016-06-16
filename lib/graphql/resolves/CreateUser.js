import { createVersionedRecord as create } from '../utils/db'

export default function CreateUser (obj, args, source, info) {
  let { cursor, config } = this.globals.getDBConfig(this, info)
  let changeLog = args.changeLog || {user: 'SYSTEM', message: 'CREATED RECORD'}
  this.utils.merge(changeLog, {date: new Date(), type: 'CREATE'})
  return create(cursor, config, {
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
