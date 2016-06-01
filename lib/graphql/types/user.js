import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString
} from 'graphql/type'
import _version from './_version'

export default new GraphQLObjectType({
  name: 'User',
  description: 'Basic user type',
  fields: () => ({
    _metadata: { type: _version },
    id: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) }
  })
})
