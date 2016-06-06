export default {
  description: 'Basic user type',
  fields: {
    _metadata: { type: 'VersionMetadata' },
    id: { type: 'String', nullable: false },
    firstName: { type: 'String', nullable: false },
    lastName: { type: 'String', nullable: false },
    email: { type: 'String', nullable: false }
  }
}
