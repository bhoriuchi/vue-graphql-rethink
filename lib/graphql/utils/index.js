import _ from 'lodash'
import semver from 'semver'
import { GraphQLError } from 'graphql/error'

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

function publishRecord (r, type, args) {
  let table = r.db(type.db).table(type.table)
  let v = semver.parse(args.version)

  //  get the current database time
  return r.now().run().then(function (ts) {

    let changeLog = args.changeLog || { user: 'SYSTEM', message: 'PUBLISHED RECORD' }
    _.merge(changeLog, { date: ts, type: 'PUBLISH' })

    //  get the draft to be published
    return table.get(args.id).run().then(function (record) {
      if (!record) throw new GraphQLError(`NotFoundError: ${args.id} was not found`)
      if (_.get(record, '_metadata.version')) throw new GraphQLError(`VersionError: ${args.id} is already published`)

      //  find the current major version
      return table.filter(function (rec) {
        return rec('_metadata')('version').match('^'.concat(v.major).concat('.')).and(
          rec('_metadata')('validTo').eq(null)
        ).and(
          rec('_metadata')('recordId').eq(record._metadata.recordId)
        )
      }).limit(1).run().then(function (current) {

        //  if there is a current version, set its valid to date
        if (current.length > 0) {
          let curVersion = _.get(current[0], '_metadata.version')
          // check the semver
          if (!semver.gt(args.version, curVersion)) throw new GraphQLError(`VersionError: \
the current published version (${curVersion}) is greather than or equal to the requested \
version (${args.version}) and cannot be published`)
          return table.get(current[0].id).update({
            _metadata: {
              validTo: ts /*,
              changeLog: r.row('changeLog').append(_.merge(_.clone(changeLog), { date: ts, type: 'PUBLISH' })) */
            }
          }).run()
        }
      }).then(function () {

        //  set the valid from date and version on the draft
        return table.get(args.id).update({
          _metadata: {
            version: args.version,
            validFrom: ts /* ,
            changeLog: r.row('changeLog').append(_.merge(_.clone(changeLog), { date: ts, type: 'VERSION' })) */
          }
        }, { returnChanges: true }).run()
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
