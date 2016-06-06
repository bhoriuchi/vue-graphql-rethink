import _ from 'lodash'
import semver from 'semver'
import {
  ERR_ALREADY_PUBLISHED,
  ERR_CURRENT_VERSION_HIGHER,
  ERR_INVALID_VERSION,
  ERR_NOT_FOUND,
  ERR_NO_RECORD,
  ERR_PUBLISH_FAILED,
  ERR_UNKNOWN
} from '../errors'

const DEFAULT_VERSION = '0.1.0'

function graphResult (result) {
  if (result.errors && result.errors.length > 0) {
    result.errors = _.map(result.errors, function (err) {
      return err.message
    })
  }
  return result
}

function getVersion (r, type, args) {
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
    q = q.filter(function (rec) {
      return rec('_metadata')('recordId').eq(args.recordId).and(
        rec('_metadata')('validFrom').gte(args.date)
      ).and(
        rec('_metadata')('validTo').lt(args.date).or(
          rec('_metadata')('validTo').eq(null)
        )
      )
    })
  }
  return q.run()
}

function createRecord (r, type, payload) {
  let table = r.db(type.db).table(type.table)
  let options = { returnChanges: true }
  return table.insert(payload, options).run().then(function (result) {
    if (result.changes.length > 0) return result.changes[0].new_val
    return result
  })
}

function branchRecord (r, type, args) {
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

function forkRecord (r, type, args) {
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

//  get the current major version
function getCurrentMajorVersion (table, record) {
  let recordId = _.get(record, '_metadata.recordId')
  if (!recordId) throw ERR_NO_RECORD(record.id)

  return table.filter(function (rec) {

    //  search for a published version that belongs to the record that has
    //  a validFrom date but no validTo date. this will be the current version
    return rec('_metadata')('version').ne(null).and(
      rec('_metadata')('recordId').eq(recordId)
    ).and(
      rec('_metadata')('validTo').eq(null)
    ).and(
      rec('_metadata')('validFrom').ne(null)
    )
  }).limit(1).pluck('id', { '_metadata': ['version'] }).run().then(function (major) {
    if (major.length > 0) return major[0]
    return null
  })
}

function publishRecord (r, type, args) {
  let newVersion = DEFAULT_VERSION
  let v = semver.parse(args.version)
  let incVersion = _.includes(['major', 'minor', 'patch', 'build'], _.toLower(args.version))
  let table = r.db(type.db).table(type.table)
  let changeLog = args.changeLog || { user: 'SYSTEM', message: 'Publish' }

  //  check for valid version if specified
  if (args.version && !incVersion && !v) throw ERR_INVALID_VERSION(args)

  //  get the requested document and determine its publish version
  return table.get(args.id).pluck({ '_metadata': ['version', 'recordId'] }).run().then(function (record) {

    //  throw an error if the record was not found or is already published
    if (!record) throw ERR_NOT_FOUND(args)
    if (_.get(record, '_metadata.version')) throw ERR_ALREADY_PUBLISHED(args)

    //  get the current major version
    return getCurrentMajorVersion(table, record).then(function (current) {
      let cv = _.get(current, '_metadata.version')
      if (cv && v && !semver.gt(args.version, cv)) throw ERR_CURRENT_VERSION_HIGHER(args, cv)
      else if (!cv) newVersion = v ? v.version : c
      else if (v) newVersion = v
      else if (incVersion) newVersion = semver.inc(cv, _.toLower(args.version))
      else throw ERR_UNKNOWN({from: 'publishRecord.getCurrentMajorVersion', data: args })
      return { current: current, newVersion: newVersion }
    }).then(function (result) {
      return r.now().do(function (ts) {
        let updates = []
        if (result.current) {
          updates.push(
            table.get(result.current.id).update(function (oldVer) {
              return {
                _metadata: {
                  validTo: ts,
                  changeLog: oldVer('_metadata')('changeLog')
                    .append(_.merge(_.clone(changeLog), { date: ts, type: 'VERSION' }))
                }
              }
            })
          )
        }
        updates.push(
          table.get(args.id).update(function (newVer) {
            return {
              _metadata: {
                version: result.newVersion,
                validFrom: ts,
                changeLog: newVer('_metadata')('changeLog')
                  .append(_.merge(_.clone(changeLog), { date: ts, type: 'PUBLISH' }))
              }
            }
          }, { returnChanges: true })
        )
        return r.expr(updates)
      }).run().then(function (result) {
        let newVal = _.get(_.filter(result, 'changes'), '[0].changes[0].new_val')
        if (!newVal) throw ERR_PUBLISH_FAILED()
        return newVal
      })
    })
  })
}

const Utils = {
  graphResult,
  getVersion,
  createRecord,
  branchRecord,
  forkRecord,
  publishRecord
}

module.exports = Utils
