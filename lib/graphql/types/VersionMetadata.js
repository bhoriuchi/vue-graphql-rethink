import { main } from '../../db'
let r = main.cursor

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
        let typeName = this.utils.getReturnTypeName(info)
        let config = this.globals.tables[typeName]
        return r.db(config.db).table('use_current').filter(
          r.row('id').eq(obj.recordId).and(r.row('type').eq(config.table))
        ).count().ne(0).run()
      }
    },
    changeLog: { type: ['ChangeLog'] }
  }
}
