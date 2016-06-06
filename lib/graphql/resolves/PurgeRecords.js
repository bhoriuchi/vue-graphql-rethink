export default function PurgeRecords (cursor, objType) {
  return (obj, args, source, fieldASTs) => {
    return cursor.db(objType.db).table(objType.table).delete().run().then(function () {
      return 200
    }).catch(function (err) {
      return 500
    })
  }
}
