import _ from 'lodash'
import {
  ERR_ALREADY_PUBLISHED,
  ERR_CURRENT_VERSION_HIGHER,
  ERR_INVALID_VERSION,
  ERR_NOT_FOUND,
  ERR_NO_RECORD,
  ERR_PUBLISH_FAILED,
  ERR_UNKNOWN
} from '../errors'

export const graphResult = function (result) {
  if (result.errors && result.errors.length > 0) {
    result.errors = _.map(result.errors, function (err) {
      return err.message
    })
  }
  return result
}

export default {
  graphResult
}