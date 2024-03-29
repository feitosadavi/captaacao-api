module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dtName: 'jest'
    },
    binary: {
      version: '4.0.3',
      skipMDS: true
    },
    autoStart: false,
    replSet: {
      count: 4,
      storageEngine: 'wiredTiger'
    }
  }
}
