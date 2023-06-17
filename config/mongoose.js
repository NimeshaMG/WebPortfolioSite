const mongoose = require('mongoose');
const config = require('../config');

module.exports = function() {
  const db = mongoose.connect(config.db);
  require('../app/models/user.server.model');
  return db;
};
