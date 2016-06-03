import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString
} from 'graphql/type'
import { statusCodesEnum } from '../enums'

export default new GraphQLObjectType({
  name: '_Status',
  description: 'Status Code',
  fields: () => ({
    status: { type: new GraphQLNonNull(statusCodesEnum) },
    details: { type: GraphQLString }
  })
})
