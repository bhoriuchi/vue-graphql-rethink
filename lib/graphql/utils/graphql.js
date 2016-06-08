import _ from 'lodash'

export function graphResult (result) {
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
