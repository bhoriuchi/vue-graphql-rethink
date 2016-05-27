import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt
} from 'graphql/type'

export default new GraphQLObjectType({
  name: 'Status',
  description: 'Status Code',
  fields: () => ({
    status: { type: new GraphQLNonNull(GraphQLInt) }
  })
})
