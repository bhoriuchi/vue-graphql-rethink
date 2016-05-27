import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString
} from 'graphql/type'

export default new GraphQLObjectType({
  name: 'User',
  description: 'Basic user type',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      firstName: new GraphQLNonNull(GraphQLString),
      lastName: new GraphQLNonNull(GraphQLString),
      email: new GraphQLNonNull(GraphQLString)
    }
  })
})
