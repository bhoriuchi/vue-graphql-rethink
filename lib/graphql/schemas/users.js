import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList
} from 'graphql/type'
import { user as userType } from '../types'
import db from '../../db'
let r = db.main

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'UsersQueryType',
    fields: {
      users: {
        type: new GraphQLList(userType.obj),
        resolve: (root, args) => {
          return r.table(userType.table).run().then(function (cursor) {
            console.log('resolving')
            return cursor.toArray()
          })
        }
      }
    }
  })
})
