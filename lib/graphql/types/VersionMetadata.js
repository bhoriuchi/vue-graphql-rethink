export default {
  description: 'Metadata object for a schema',
  fields: {
    recordId: { type: 'String' },
    version: { type: 'String' },
    validFrom: { type: 'DateTime' },
    validTo: { type: 'DateTime' },
    useCurrent: { type: 'Boolean' },
    changeLog: { type: ['ChangeLog'] }
  }
}
