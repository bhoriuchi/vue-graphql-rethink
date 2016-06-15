import MutationVersionArgs from './MutationVersionArgs'
import { forkRecord, branchRecord, publishRecord } from '../utils/db'

function getConfig (self, info) {
  let typeName = self.utils.getRootFieldDef(info, '_typeName')
  return {
    cursor: self.globals.db.main.cursor,
    config: self.globals.db.main.tables[typeName]
  }
}

export default {
  fork: {
    type: 'String',
    args: MutationVersionArgs,
    resolve (obj, args, source, info) {
      let db = getConfig(this, info)
      return forkRecord(db.cursor, db.config, args)
    }
  },
  branch: {
    type: 'String',
    args: MutationVersionArgs,
    resolve (obj, args, source, info) {
      let db = getConfig(this, info)
      return branchRecord(db.cursor, db.config, args)
    }
  },
  publish: {
    type: 'String',
    args: {
      id: {type: 'String', nullable: false},
      version: {type: 'String'},
      changeLog: {type: 'ChangeLogInput'}
    },
    resolve (obj, args, source, info) {
      let db = getConfig(this, info)
      return publishRecord(db.cursor, db.config, args)
    }
  }
}
