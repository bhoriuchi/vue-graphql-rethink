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
        let typeName = this.utils.getRootFieldDef(info, '_typeName')
        let config = this.globals.db.main.tables[typeName]
        let cursor = this.globals.db.main.cursor

        return cursor.db(config.db).table(USE_CURRENT_TABLE).filter(
          cursor.row('id').eq(obj.recordId).and(cursor.row('type').eq(config.table))
        ).count().ne(0).run()
      }
    },
    changeLog: { type: ['ChangeLog'] }
  }
}
