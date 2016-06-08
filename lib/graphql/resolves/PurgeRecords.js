import { USE_CURRENT_TABLE } from '../utils/constants'

export default function PurgeRecords (cursor, objType) {
  return (obj, args, source, fieldASTs) => {
    let table = cursor.db(objType.db).table(objType.table)
    let ucTable = cursor.db(objType.db).table(USE_CURRENT_TABLE)
    return cursor.expr([
      table.delete(),
      ucTable.filter({ type: objType.table }).delete()
    ]).run().then(function () {
      return 200
    }).catch(function (err) {
      return 500
    })
  }
}
