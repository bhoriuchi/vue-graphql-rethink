module.exports = {
  socket: {
    server: 'http://localhost:8080'
  },
  database: {
    main: {
      type: 'rethinkdb',
      name: 'test',
      host: 'localhost',
      port: 28015
    }
  }
}
