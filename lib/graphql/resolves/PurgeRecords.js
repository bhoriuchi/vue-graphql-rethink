import { USE_CURRENT_TABLE } from '../utils/constants'

export default function PurgeRecords (obj, args, source, info) {
  let { cursor, config } = this.globals.getDBConfig(this, info)
  let table = cursor.db(config.db).table(config.table)
  let ucTable = cursor.db(config.db).table(USE_CURRENT_TABLE)
  return cursor.expr([
    table.delete(),
    ucTable.filter({ type: config.table }).delete()
  ]).run().then(function () {
    return 200
  }).catch(function (err) {
    return 500
  })
}
