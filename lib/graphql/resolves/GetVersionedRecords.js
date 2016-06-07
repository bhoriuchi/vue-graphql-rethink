export default function GetVersionedRecords (cursor, objType) {
  return (root, args) => {
    return cursor.db(objType.db).table(objType.table).merge(function (record) {
      return {
        useCurrent: cursor.db(objType.db).table('use_current').contains(record('_metadata')('recordId'))
      }
    }).run()
  }
}
