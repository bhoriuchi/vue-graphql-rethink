import _ from 'lodash'
import { createVersionedRecord as create } from '../utils/db'

export default function CreateUser (cursor, objType) {
  return (obj, args, source, fieldASTs) => {
    let changeLog = args.changeLog || {user: 'SYSTEM', message: 'CREATED RECORD'}
    _.merge(changeLog, {date: new Date(), type: 'CREATE'})
    return create(cursor, objType, {
      _metadata: {
        recordId: cursor.uuid(),
        version: null,
        validFrom: null,
        validTo: null,
        useCurrent: args.useCurrent,
        changeLog: [changeLog]
      },
      id: cursor.uuid(),
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email
    })
  }
}
