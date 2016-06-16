export default function GetRecords (source, args, context, info) {
  let { cursor, config } = this.globals.getDBConfig(this, info)
  return cursor.db(config.db).table(config.table).run()
}
