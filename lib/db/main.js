import _ from 'lodash'
import rethinkdbdash from 'rethinkdbdash'
console.log(new Date(), 'rethinkdbdash imported')
let r = rethinkdbdash()

const tables = {
  UseCurrent: { db: 'test', table: 'use_current' },
  User: { db: 'test', table: 'user' }
}

function createTable (db, name, options) {
  return r.db(db).tableCreate(name, options).run().then(function () {
    console.log('RETHINKDB: Created Table', name, 'on', db)
  }).catch(function (err) {
    console.log('RETHINKDB: Table', name, 'on', db, 'exists')
  })
}

_.forEach(tables, function (type) {
  createTable(type.db, type.table, type.options)
})

export default { cursor: r, tables: tables }
