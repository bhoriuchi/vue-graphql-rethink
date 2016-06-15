export default function GetRecords (source, args, context, info) {
  let typeName = this.utils.getRootFieldDef(info, '_typeName')
  let cursor = this.globals.db.main.cursor
  let typeObj = this.globals.db.main.tables[typeName]
  return cursor.db(typeObj.db).table(typeObj.table).run()
}
