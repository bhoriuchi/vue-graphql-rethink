import _ from 'lodash'

export function graphResult (result) {
  if (result.errors && result.errors.length > 0) {
    result.errors = _.map(result.errors, function (err) {
      return err.message
    })
  }
  return result
}

export function getVersion (r, type, args) {
  let q = r.db(type.db).table(type.table)
  if (args.id) {
    q = q.get(args.id)
  } else if (args.recordId && args.version) {
    q = q.filter({
      _metadata: {
        recordId: args.recordId,
        version: args.version
      }
    })
  } else if (args.recordId && args.date) {
    q = q.filter(function (user) {
      return user('_metadata')('recordId').eq(args.recordId).and(
        user('_metadata')('validFrom').gte(args.date)
      ).and(
        user('_metadata')('validTo').lt(args.date).or(
          user('_metadata')('validTo').eq(null)
        )
      )
    })
  }
  return q.run()
}

export function createRecord (r, type, payload) {
  let table = r.db(type.db).table(type.table)
  let options = { returnChanges: true }
  return table.insert(payload, options).run().then(function (result) {
    if (result.changes.length > 0) return result.changes[0].new_val
    return result
  })
}

export function branchRecord (r, type, args) {
  return getVersion(r, type, args).then(function (record) {
    if (record) {
      return createRecord(r, type, _.merge(record, {
        _metadata: {
          version: null,
          validFrom: null,
          validTo: null
        },
        id: r.uuid()
      }))
    }
  })
}

export function forkRecord (r, type, args) {
  return getVersion(r, type, args).then(function (record) {
    if (record) {
      return createRecord(r, type, _.merge(record, {
        _metadata: {
          recordId: r.uuid(),
          version: null,
          validFrom: null,
          validTo: null
        },
        id: r.uuid()
      }))
    }
  })
}
