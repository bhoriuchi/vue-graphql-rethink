import _ from 'lodash'
import { createRecord as create } from '../utils'

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
        changeLog: [changeLog]
      },
      id: cursor.uuid(),
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email
    })
  }
}
