export default function DeleteRecord (obj, args, source, info) {
  let { cursor, config } = this.globals.getDBConfig(this, info)
  let table = cursor.db(config.db).table(config.table)
  return table.get(args.id).delete().run().then(function () {
    return 200
  }).catch(function (err) {
    return 500
  })
}
