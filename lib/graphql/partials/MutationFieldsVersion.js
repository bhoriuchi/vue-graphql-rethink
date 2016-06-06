import MutationVersionArgs from './MutationVersionArgs'
import { forkRecord, branchRecord, publishRecord } from '../utils'

export default function MutationFieldsVersion (options) {
  let returnType = options.returnType
  let cursor = options.cursor
  let objType = { db: options.db, table: options.table }
  return {
    fork: {
      type: returnType,
      args: MutationVersionArgs,
      resolve: (obj, args, source, fieldASTs) => {
        return forkRecord(cursor, objType, args)
      }
    },
    branch: {
      type: returnType,
      args: MutationVersionArgs,
      resolve: (obj, args, source, fieldASTs) => {
        return branchRecord(cursor, objType, args)
      }
    },
    publish: {
      type: returnType,
      args: {
        id: { type: 'String', nullable: false },
        version: { type: 'String' },
        changeLog: { type: 'InputChangeLog' }
      },
      resolve: (obj, args, source, fieldASTs) => {
        return publishRecord(cursor, objType, args)
      }
    }
  }
}
