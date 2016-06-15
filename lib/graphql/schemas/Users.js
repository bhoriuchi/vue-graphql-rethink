import db from '../../db'
import { DeleteRecord, PurgeRecords } from '../resolves'

let returnType = 'User'
let ucType = 'UseCurrent'
let cursor = db.main.cursor
let tables = db.main.tables
let typeObj = tables[returnType]

export default {
  query: {
    fields: {
      users: {
        type: [returnType],
        resolve: 'GetRecords',
        _typeName: returnType
      },
      useCurrent: {
        type: [ucType],
        resolve: 'GetRecords',
        _typeName: ucType
      }
    }
  },
  mutation: {
    _customData: {
      returnType
    },
    extendFields: {
      MutationFieldsVersion: {
        fork: { type: returnType, _typeName: returnType },
        branch: { type: returnType, _typeName: returnType },
        publish: { type: returnType, _typeName: returnType }
      }
    },
    fields: {
      create: {
        type: returnType,
        args: {
          firstName: { type: 'String', nullable: false },
          lastName: { type: 'String', nullable: false },
          email: { type: 'String', nullable: false },
          useCurrent: { type: 'Boolean', defaultValue: false },
          changeLog: { type: 'ChangeLogInput', nullable: false }
        },
        resolve: 'CreateUser',
        _typeName: returnType
      },
      delete: {
        type: 'Int',
        args: {
          id: { type: 'String', nullable: false }
        },
        resolve: DeleteRecord(cursor, typeObj),
        _typeName: returnType

      },
      purge: {
        type: 'Int',
        resolve: PurgeRecords(cursor, typeObj),
        _typeName: returnType
      }
    }
  }
}
