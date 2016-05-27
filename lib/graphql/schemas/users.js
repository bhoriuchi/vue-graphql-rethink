import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList
} from 'graphql/type'
import { user as userType, status as statusType } from '../types'
import db from '../../db'
let r = db.main

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
      createUser: {
        type: userType.obj,
        args: {
          firstName: { name: 'firstName', type: new GraphQLNonNull(GraphQLString) },
          lastName: { name: 'lastName', type: new GraphQLNonNull(GraphQLString) },
          email: { name: 'email', type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: (obj, args, source, fieldASTs) => {
          return r.db(userType.db).table(userType.table).insert({
            id: r.uuid(),
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email
          }, { returnChanges: true }).run().then(function (result) {
            if (result.changes.length > 0) return result.changes[0].new_val
            return result
          })
        }
      },
      deleteUser: {
        type: statusType.obj,
        args: {
          id: { name: 'id', type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: (obj, args, source, fieldASTs) => {
          return r.db(userType.db).table(userType.table).get(args.id).delete().run().then(function () {
            return { status: 200 }
          }).catch(function (err) {
            return { status: 500 }
          })
        }
      }
    }
  })
})
