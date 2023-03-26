const mongoose = require("mongoose");

const schema = mongoose.model('RolSetting', new mongoose.Schema({
  _Id: String,
}));

module.exports = schema;