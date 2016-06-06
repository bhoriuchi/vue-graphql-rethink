import _ from 'lodash'
import db from '../../db'
import { CreateUser, DeleteRecord, GetRecords, PurgeRecords } from '../resolves'
let table = 'user'
let cursor = db.main.cursor
let tables = db.main.tables
let config = tables[table]
let type = { db: config.db, table: table }
import { MutationFieldsVersion } from '../partials'

export default {
  query: {
    fields: {
      users: {
        type: ['user'],
        resolve: GetRecords(cursor, type)
      }
    }
  },
  mutation: {
    fields: _.merge({
      create: {
        type: 'user',
        args: {
          firstName: { type: 'String', nullable: false },
          lastName: { type: 'String', nullable: false },
          email: { type: 'String', nullable: false },
          changeLog: { type: 'InputChangeLog', nullable: false }
        },
        resolve: CreateUser(cursor, type)
      },
      delete: {
        type: 'Int',
        args: {
          id: { type: 'String', nullable: false }
        },
        resolve: DeleteRecord(cursor, type)
      },
      purge: {
        type: 'Int',
        resolve: PurgeRecords(cursor, type)
      }
    }, MutationFieldsVersion({
      cursor: cursor,
      returnType: 'user',
      db: config.db,
      table: table
    }))
  }
}
