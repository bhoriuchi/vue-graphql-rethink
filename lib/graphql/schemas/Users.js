import { USE_CURRENT_TYPE } from '../utils/constants'
const returnType = 'User'

export default {
  query: {
    fields: {
      users: {
        type: [returnType],
        resolve: 'GetRecords',
        _typeName: returnType
      },
      useCurrent: {
        type: [USE_CURRENT_TYPE],
        resolve: 'GetRecords',
        _typeName: USE_CURRENT_TYPE
      },
      versioned: {
        type: [returnType],
        args: {
          id: 'String',
          version: 'String'
        },
        resolve: 'GetUser',
        _typeName: returnType
      }
    }
  },
  mutation: {
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
        resolve: 'DeleteRecord',
        _typeName: returnType

      },
      purge: {
        type: 'Int',
        resolve: 'PurgeRecords',
        _typeName: returnType
      }
    }
  }
}
