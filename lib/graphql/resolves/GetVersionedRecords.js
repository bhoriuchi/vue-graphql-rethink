import _ from 'lodash'
import { USE_CURRENT_FIELD, USE_CURRENT_TABLE } from '../utils/constants'

export default function GetVersionedRecords (cursor, objType) {
  let table = cursor.db(objType.db).table(objType.table)
  let ucTable = cursor.db(objType.db).table(USE_CURRENT_TABLE)
  return (root, args) => {
    return table.merge(function (record) {
      return _.set({}, `_metadata.${USE_CURRENT_FIELD}`, ucTable.filter(function (current) {
        return current('id').eq(record('_metadata')('recordId')).and(
          current('type').eq(objType.table)
        )
      }).count().ne(0))
    }).run()
  }
}
