import _ from 'lodash'
import db from '../../db'
import { CreateUser, DeleteRecord, GetRecords, PurgeRecords } from '../resolves'
import { MutationFieldsVersion } from '../partials'

let returnType = 'User'
let ucType = 'UseCurrent'
let cursor = db.main.cursor
let tables = db.main.tables
let typeObj = tables[returnType]
let ucObj = tables[ucType]

export default {
  query: {
    fields: {
      users: {
        type: [returnType],
        resolve: GetRecords(cursor, typeObj)
      },
      useCurrent: {
        type: ['UseCurrent'],
        resolve: GetRecords(cursor, ucObj)
      }
    }
  },
  mutation: {
    fields: _.merge({
      create: {
        type: returnType,
        args: {
          firstName: { type: 'String', nullable: false },
          lastName: { type: 'String', nullable: false },
          email: { type: 'String', nullable: false },
          useCurrent: { type: 'Boolean', defaultValue: false },
          changeLog: { type: 'ChangeLogInput', nullable: false }
        },
        resolve: CreateUser(cursor, typeObj)
      },
      delete: {
        type: 'Int',
        args: {
          id: { type: 'String', nullable: false }
        },
        resolve: DeleteRecord(cursor, typeObj)
      },
      purge: {
        type: 'Int',
        resolve: PurgeRecords(cursor, typeObj)
      }
    }, MutationFieldsVersion({
      cursor: cursor,
      returnType: returnType,
      db: typeObj.db,
      table: typeObj.table
    }))
  }
}
