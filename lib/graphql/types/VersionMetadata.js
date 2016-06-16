import { USE_CURRENT_TABLE } from '../utils/constants'

export default {
  description: 'Metadata object for a schema',
  fields: {
    recordId: { type: 'String' },
    version: { type: 'String' },
    validFrom: { type: 'DateTime' },
    validTo: { type: 'DateTime' },
    useCurrent: {
      type: 'Boolean',
      resolve (obj, args, context, info) {
        let { cursor, config } = this.globals.getDBConfig(this, info)
        return cursor.db(config.db).table(USE_CURRENT_TABLE).filter(
          cursor.row('id').eq(obj.recordId).and(cursor.row('type').eq(config.table))
        ).count().ne(0).run()
      }
    },
    changeLog: { type: ['ChangeLog'] }
  }
}
