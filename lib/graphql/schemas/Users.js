import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLInputObjectType
} from 'graphql/type'
import _ from 'lodash'
import { user as userType, _status as statusType, _changelog as changeLogType } from '../types'
import { createRecord, branchRecord, forkRecord, publishRecord } from '../utils'
import { changelog as changeLogInput } from '../inputs'
import db from '../../db'
let r = db.main

// version arguments
const versionArgs = {
  id: { name: 'id', type: GraphQLString },
  recordId: { name: 'recordId', type: GraphQLString },
  version: { name: 'version', type: GraphQLString },
  date: { name: 'date', type: GraphQLInt }
}

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'UsersQueryType',
    fields: {
      users: {
        type: new GraphQLList(userType.obj),
        resolve: (root, args) => {
          return r.db(userType.db).table(userType.table).run()
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      create: {
        type: userType.obj,
        args: {
          firstName: { name: 'firstName', type: new GraphQLNonNull(GraphQLString) },
          lastName: { name: 'lastName', type: new GraphQLNonNull(GraphQLString) },
          email: { name: 'email', type: new GraphQLNonNull(GraphQLString) },
          changeLog: { name: 'changeLog', type: changeLogInput }
        },
        resolve: (obj, args, source, fieldASTs) => {
          let changeLog = args.changeLog || { user: 'SYSTEM', message: 'CREATED RECORD' }
          _.merge(changeLog, { date: new Date(), type: 'CREATE' })
          return createRecord(r, userType, {
            _metadata: {
              recordId: r.uuid(),
              version: null,
              validFrom: null,
              validTo: null,
              changeLog: [changeLog]
            },
            id: r.uuid(),
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email
          })
        }
      },
      fork: {
        type: userType.obj,
        args: {
          id: { name: 'id', type: GraphQLString },
          recordId: { name: 'recordId', type: GraphQLString },
          version: { name: 'version', type: GraphQLString },
          date: { name: 'date', type: GraphQLInt },
          changeLog: { name: 'changeLog', type: changeLogInput }
        },
        resolve: (obj, args, source, fieldASTs) => {
          return forkRecord(r, userType, args)
        }
      },
      branch: {
        type: userType.obj,
        args: {
          id: { name: 'id', type: GraphQLString },
          recordId: { name: 'recordId', type: GraphQLString },
          version: { name: 'version', type: GraphQLString },
          date: { name: 'date', type: GraphQLInt },
          changeLog: { name: 'changeLog', type: changeLogInput }
        },
        resolve: (obj, args, source, fieldASTs) => {
          return branchRecord(r, userType, args)
        }
      },
      publish: {
        type: userType.obj,
        args: {
          id: { name: 'id', type: GraphQLString },
          version: { name: 'version', type: GraphQLString },
          changeLog: { name: 'changeLog', type: changeLogInput }
        },
        resolve: (obj, args, source, fieldASTs) => {
          return publishRecord(r, userType, args)
        }
      },
      delete: {
        type: GraphQLInt,
        args: {
          id: { name: 'id', type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: (obj, args, source, fieldASTs) => {
          return r.db(userType.db).table(userType.table).get(args.id).delete().run().then(function () {
            return 200
          }).catch(function (err) {
            return 500
          })
        }
      },
      purge: {
        type: GraphQLInt,
        resolve: (obj, args, source, fieldASTs) => {
          return r.db(userType.db).table(userType.table).delete().run().then(function () {
            return 200
          }).catch(function (err) {
            return 500
          })
        }
      }
    }
  })
})
