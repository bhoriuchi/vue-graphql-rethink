export default function GetRecords (cursor, objType) {
  return (root, args) => {
    return cursor.db(objType.db).table(objType.table).run()
  }
}
