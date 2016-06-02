import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString
} from 'graphql/type'
import { changelogTypesEnum } from '../enums'
import CustomGraphQLDateType from 'graphql-custom-datetype'

export default new GraphQLObjectType({
  name: '_ChangeLog',
  description: 'Change log object',
  fields: () => ({
    date: { type: CustomGraphQLDateType },
    type: { type: changelogTypesEnum },
    user: { type: GraphQLString },
    message: { type: GraphQLString }
  })
})
