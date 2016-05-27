require('babel-register')
var db = require('./db').default
var graphql = require('./graphql').default
var server = require('./server').default

module.exports = {
  db,
  graphql,
  server
}
