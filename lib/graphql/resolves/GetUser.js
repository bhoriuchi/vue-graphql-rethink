// import _ from 'lodash'
// import semver from 'semver'

export default function GetUser (source, args, context, info) {
  let { cursor, config } = this.globals.getDBConfig(this, info)
  console.log(args)
  return cursor.db(config.db).table(config.table).run()
}
