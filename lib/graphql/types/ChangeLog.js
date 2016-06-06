export default {
  description: 'Change log object',
  fields: {
    date: { type: 'DateTime' },
    type: { type: 'EnumChangeLogType' },
    user: { type: 'String' },
    message: { type: 'String' }
  }
}
