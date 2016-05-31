import _ from 'lodash'
import rethinkdbdash from 'rethinkdbdash'
import types from '../graphql/types'
console.log(new Date(), 'rethinkdbdash imported')
let r = rethinkdbdash()

function createTable (db, name) {
  return r.db(db).tableCreate(name).run().then(function () {
    console.log('RETHINKDB: Created Table', name, 'on', db)
  }).catch(function (err) {
    console.log('RETHINKDB: Table', name, 'on', db, 'exists')
  })
}

_.forEach(types, function (type) {
  if (type.db && type.table) createTable(type.db, type.table)
})

export default r
