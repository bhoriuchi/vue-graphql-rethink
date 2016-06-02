import {
  GraphQLString,
  GraphQLInt,
  GraphQLInputObjectType
} from 'graphql/type'
import { changelogTypesEnum } from '../enums'
import CustomGraphQLDateType from 'graphql-custom-datetype'

export default new GraphQLInputObjectType({
  name: 'changeLogInput',
  fields: {
    user: { type: GraphQLString },
    message: { type: GraphQLString }
  }
})
