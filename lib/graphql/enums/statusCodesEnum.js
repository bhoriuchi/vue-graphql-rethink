import {
  GraphQLEnumType
} from 'graphql/type'

export default new GraphQLEnumType({
  name: 'statusCodesEnum',
  values: {
    OK: { value: 200 },
    SERVER_ERROR: { value: 500 }
  }
})
