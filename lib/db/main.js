import _ from 'lodash'
import rethinkdbdash from 'rethinkdbdash'
console.log(new Date(), 'rethinkdbdash imported')
let r = rethinkdbdash()

const tables = {
  user: { db: 'test' }
}

function createTable (db, name) {
  return r.db(db).tableCreate(name).run().then(function () {
    console.log('RETHINKDB: Created Table', name, 'on', db)
  }).catch(function (err) {
    console.log('RETHINKDB: Table', name, 'on', db, 'exists')
  })
}

_.forEach(tables, function (config, table) {
  createTable(config.db, table)
})

export default { cursor: r, tables: tables }
