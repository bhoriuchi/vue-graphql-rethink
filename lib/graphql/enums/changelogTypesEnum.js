import {
  GraphQLEnumType
} from 'graphql/type'

export default new GraphQLEnumType({
  name: 'changelogTypesEnum',
  values: {
    CREATE: { value: 'CREATE' },
    UPDATE: { value: 'UPDATE' },
    BRANCH: { value: 'BRANCH' },
    FORK: { value: 'FORK' },
    MERGE: { value: 'MERGE' },
    PUBLISH: { value: 'PUBLISH' },
    VERSION: { value: 'VERSION' },
    INFO: { value: 'INFO' }
  }
})
