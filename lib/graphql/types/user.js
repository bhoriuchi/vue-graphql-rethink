import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString
} from 'graphql/type'

export default new GraphQLObjectType({
  name: 'User',
  description: 'Basic user type',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) }
  })
})
