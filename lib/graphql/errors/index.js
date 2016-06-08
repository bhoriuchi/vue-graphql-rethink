import { GraphQLError } from 'graphql/error'

//  enforce a set of defined types (pseudo enum)
const ErrorTypes = {
  NotFoundError: 'NotFoundError',
  OperationFailedError: 'OperationFailedError',
  VersionError: 'VersionError',
  UnknownError: 'UnknownError'
}

export function ERR_ALREADY_PUBLISHED (args) {
 return new GraphQLError(`${ErrorTypes.VersionError}: ${args.id} is already published`)
}

export function ERR_CURRENT_VERSION_HIGHER (args, curVersion) {
  return new GraphQLError(`${ErrorTypes.VersionError}: \
the current published version (${curVersion}) is greather than or equal to the requested \
version (${args.version}) and cannot be published`)
}

export function ERR_INVALID_VERSION (args) {
  return new GraphQLError(`${ErrorTypes.VersionError}: ${args.version} is an invalid semantic version`)
}

export function ERR_NOT_FOUND (args) {
  return new GraphQLError(`${ErrorTypes.NotFoundError}: ${args.id} was not found`)
}

export function ERR_NO_RECORD (versionId) {
  return new GraphQLError(`${ErrorTypes.NotFoundError}: ${versionId} is not part of a versioned \
record or is missing a record reference`)
}

export function ERR_PUBLISH_FAILED () {
  return new GraphQLError(`${ErrorTypes.OperationFailedError}: Publish failed`)
}

export function ERR_UNKNOWN (err) {
  try {
    err = JSON.stringify(err)
  } catch (e) {
    err = String(err)
  }
  return new GraphQLError(`${ErrorTypes.UnknownError}: ${err}`)
}
