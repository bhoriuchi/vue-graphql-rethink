import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString
} from 'graphql/type'

export default new GraphQLObjectType({
  name: '_Meta',
  description: 'Metadata object for a schema',
  fields: () => ({
    recordId: { type: GraphQLString },
    version: { type: GraphQLString },
    validFrom: { type: GraphQLInt },
    validTo: { type: GraphQLInt }
  })
})
