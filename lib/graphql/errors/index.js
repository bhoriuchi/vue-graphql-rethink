import { GraphQLError } from 'graphql/error'

//  enforce a set of defined types (pseudo enum)
const ErrorTypes = {
  NotFoundError: 'NotFoundError',
  OperationFailedError: 'OperationFailedError',
  VersionError: 'VersionError',
  UnknownError: 'UnknownError'
}

function ERR_ALREADY_PUBLISHED (args) {
 return new GraphQLError(`${ErrorTypes.VersionError}: ${args.id} is already published`)
}

function ERR_CURRENT_VERSION_HIGHER (args, curVersion) {
  return new GraphQLError(`${ErrorTypes.VersionError}: \
the current published version (${curVersion}) is greather than or equal to the requested \
version (${args.version}) and cannot be published`)
}

function ERR_INVALID_VERSION (args) {
  return new GraphQLError(`${ErrorTypes.VersionError}: ${args.version} is an invalid semantic version`)
}

function ERR_NOT_FOUND (args) {
  return new GraphQLError(`${ErrorTypes.NotFoundError}: ${args.id} was not found`)
}

function ERR_NO_RECORD (versionId) {
  return new GraphQLError(`${ErrorTypes.NotFoundError}: ${versionId} is not part of a versioned \
record or is missing a record reference`)
}

function ERR_PUBLISH_FAILED () {
  return new GraphQLError(`${ErrorTypes.OperationFailedError}: Publish failed`)
}

function ERR_UNKNOWN (err) {
  try {
    err = JSON.stringify(err)
  } catch (e) {
    err = String(err)
  }
  return new GraphQLError(`${ErrorTypes.UnknownError}: ${err}`)
}

const Errors = {
  ERR_ALREADY_PUBLISHED,
  ERR_CURRENT_VERSION_HIGHER,
  ERR_INVALID_VERSION,
  ERR_NOT_FOUND,
  ERR_NO_RECORD,
  ERR_PUBLISH_FAILED,
  ERR_UNKNOWN
}

module.exports = Errors
