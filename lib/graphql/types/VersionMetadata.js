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
        let returnType = this.utils.getTypeConfig(info, '_customData.returnType')
        let config = this.globals.db.main.tables[returnType]
        let cursor = this.globals.db.main.cursor

        return cursor.db(config.db).table('use_current').filter(
          cursor.row('id').eq(obj.recordId).and(cursor.row('type').eq(config.table))
        ).count().ne(0).run()
      }
    },
    changeLog: { type: ['ChangeLog'] }
  }
}
