import { versionFilter } from '../utils/db'

export default function GetVersionedRecords (source, args, context, info) {
  let { cursor, config } = this.globals.getDBConfig(this, info)
  let vFilter = versionFilter(cursor, config, { recordId: args.id, version: args.version })
  return vFilter.run()
}
