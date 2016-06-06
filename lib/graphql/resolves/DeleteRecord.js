export default function DeleteRecord (cursor, objType) {
  return (obj, args, source, fieldASTs) => {
    return cursor.db(objType.db).table(objType.table).get(args.id).delete().run().then(function () {
      return 200
    }).catch(function (err) {
      return 500
    })
  }
}
