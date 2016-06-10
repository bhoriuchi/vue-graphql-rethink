/*
 * Define a graphql-factory multi-type change log
 */
export default {
  type: ['Object', 'Input' ],
  description: 'Change log object',
  fields: {
    date: { type: 'DateTime' },
    type: { type: 'EnumChangeLogType' },
    user: { type: 'String' },
    message: {
      Object: 'String',
      Input: { type: 'String', nullable: false }
    }
  }
}
