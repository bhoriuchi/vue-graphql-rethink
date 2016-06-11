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
        let db = this.globals.db
        let config = db.main.tables[typeName]
        let r = db.main.cursor
        
        return r.db(config.db).table('use_current').filter(
          r.row('id').eq(obj.recordId).and(r.row('type').eq(config.table))
        ).count().ne(0).run()
      }
    },
    changeLog: { type: ['ChangeLog'] }
  }
}
