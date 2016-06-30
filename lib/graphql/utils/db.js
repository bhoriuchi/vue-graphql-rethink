import _ from 'lodash'
import semver from 'semver'
import {
  ERR_ALREADY_PUBLISHED,
  ERR_CURRENT_VERSION_HIGHER,
  ERR_NO_CURRENT_CANT_INCREMENT,
  ERR_INVALID_VERSION,
  ERR_NOT_FOUND,
  ERR_NO_RECORD,
  ERR_PUBLISH_FAILED,
  ERR_VERSION_NOT_FOUND,
  ERR_UNKNOWN
} from '../errors'
import {
  DEFAULT_VERSION,
  USE_CURRENT_TABLE,
  USE_CURRENT_FIELD
} from '../utils/constants'

export function toISO (dateString) {
  try {
    return new Date(dateString).toISOString()
  } catch (err) {
    return null
  }
}

export function versionFilter (r, type, args) {
  let q = r.db(type.db).table(type.table)
  let uc = r.db(type.db).table(USE_CURRENT_TABLE)

  //  check for a date in the version field and set it as the date field
  if (args.version && !semver.valid(args.version) && toISO(args.version)) {
    args.date = args.version
    args.version = undefined
  }

  if (args.id) {
    q = q.get(args.id)
  } else if (args.version) {
    if (!semver.valid(args.version)) throw ERR_INVALID_VERSION(args)
    let filter = { _metadata: { version: args.version } }
    if (args.recordId) filter._metadata.recordId = args.recordId
    q = q.filter(filter)
  } else if (args.date) {
    q = q.filter((rec) => {
      let subq = rec('_metadata')('validFrom').ne(null).and(
        r.branch(
          uc.filter((cur) => {
            return cur('id').eq(rec('_metadata')('recordId')).and(cur('type').eq(type.table))
          }).count().ne(0),
          rec('_metadata')('validTo').eq(null),
          r.ISO8601(toISO(args.date)).during(
            rec('_metadata')('validFrom'),
            r.branch(
              rec('_metadata')('validTo').eq(null),
              r.now(),
              rec('_metadata')('validTo')
            )
          )
        )
      )
      if (args.recordId) subq = subq.and(rec('_metadata')('recordId').eq(args.recordId))
      return subq
    })
  } else {
    q = q.filter((rec) => {
      return rec('_metadata')('validFrom').ne(null).and(
        rec('_metadata')('validTo').eq(null)
      )
    })
  }
  return q
}

export function getVersion (r, type, args) {
  return versionFilter(r, type, args).run().then(function (records) {
    if (args.recordId) {
      let isArray = _.isArray(records)
      if (isArray && records.length > 0) records = records[0]
      else if (!records || (isArray && records.length === 0)) throw ERR_VERSION_NOT_FOUND()
    }
    return records
  })
}

export function createRecord (r, type, payload) {
  let table = r.db(type.db).table(type.table)
  let options = { returnChanges: true }
  return table.insert(payload, options).run().then(function (result) {
    if (result.changes.length > 0) return result.changes[0].new_val
    return result
  })
}

export function createVersionedRecord (r, type, payload) {
  let ucTable = r.db(type.db).table(USE_CURRENT_TABLE)
  let table = r.db(type.db).table(type.table)
  let options = { returnChanges: true }
  let useCurrent = _.get(payload, USE_CURRENT_FIELD)
  payload = _.omit(payload, USE_CURRENT_FIELD)

  return r.uuid().do(function(uuid) {
    payload._metadata.recordId = uuid
    let updates = [ table.insert(payload, options) ]
    if (useCurrent === true) updates.push(ucTable.insert({ id: uuid, type: type.table }))
    return r.expr(updates)
  }).then(function (result) {
    let newVal = _.get(_.filter(result, 'changes'), '[0].changes[0].new_val')
    newVal._metadata[USE_CURRENT_FIELD] = useCurrent
    return newVal
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

//  get the current major version
export function getCurrentMajorVersion (table, record) {
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

export function publishRecord (r, type, args) {
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
      else if (!cv && incVersion) throw ERR_NO_CURRENT_CANT_INCREMENT()
      else if (!cv) newVersion = v ? v.version : DEFAULT_VERSION
      else if (incVersion) newVersion = semver.inc(cv, _.toLower(args.version))
      else if (!v && cv) newVersion = semver.inc(cv, 'patch')
      else if (!v && !cv) newVersion = DEFAULT_VERSION
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

export function getDBConfig (self, info) {
  let typeName = self.utils.getRootFieldDef(info, '_typeName')
  return {
    cursor: self.globals.db.main.cursor,
    config: self.globals.db.main.tables[typeName]
  }
}

export default {
  getVersion,
  createRecord,
  createVersionedRecord,
  branchRecord,
  forkRecord,
  publishRecord,
  getDBConfig
}
