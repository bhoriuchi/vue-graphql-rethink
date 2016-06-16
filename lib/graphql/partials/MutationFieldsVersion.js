import MutationVersionArgs from './MutationVersionArgs'
import { forkRecord, branchRecord, publishRecord } from '../utils/db'

export default {
  fork: {
    type: 'String',
    args: MutationVersionArgs,
    resolve (obj, args, source, info) {
      let { cursor, config } = this.globals.getDBConfig(this, info)
      return forkRecord(cursor, config, args)
    }
  },
  branch: {
    type: 'String',
    args: MutationVersionArgs,
    resolve (obj, args, source, info) {
      let { cursor, config } = this.globals.getDBConfig(this, info)
      return branchRecord(cursor, config, args)
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
      let { cursor, config } = this.globals.getDBConfig(this, info)
      return publishRecord(cursor, config, args)
    }
  }
}
