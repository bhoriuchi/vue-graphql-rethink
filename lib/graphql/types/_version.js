import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} from 'graphql/type'
import _changelog from './_changelog'
import CustomGraphQLDateType from 'graphql-custom-datetype'

export default new GraphQLObjectType({
  name: '_Meta',
  description: 'Metadata object for a schema',
  fields: () => ({
    recordId: { type: GraphQLString },
    version: { type: GraphQLString },
    validFrom: { type: CustomGraphQLDateType },
    validTo: { type: CustomGraphQLDateType },
    changeLog: { type: new GraphQLList(_changelog) }
  })
})
