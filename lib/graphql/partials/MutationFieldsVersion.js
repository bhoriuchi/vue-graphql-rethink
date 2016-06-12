import MutationVersionArgs from './MutationVersionArgs'
import { forkRecord, branchRecord, publishRecord } from '../utils/db'

function getConfig (def, typeName) {
  return {
    cursor: def.globals.db.main.cursor,
    config: def.globals.db.main.tables[typeName]
  }
}

export default {
  fork: {
    type: 'String',
    args: MutationVersionArgs,
    resolve (obj, args, source, info) {
      let returnType = this.utils.getTypeConfig(info, '_customData.returnType')
      let db = getConfig(this, returnType)
      return forkRecord(db.cursor, db.config, args)
    }
  },
  branch: {
    type: 'String',
    args: MutationVersionArgs,
    resolve (obj, args, source, info) {
      let returnType = this.utils.getTypeConfig(info, '_customData.returnType')
      let db = getConfig(this, returnType)
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
      let returnType = this.utils.getTypeConfig(info, '_customData.returnType')
      let db = getConfig(this, returnType)
      return publishRecord(db.cursor, db.config, args)
    }
  }
}
