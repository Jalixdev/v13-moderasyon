const mongoose = require("mongoose");

const schema = mongoose.model('LogSetting', new mongoose.Schema({
  _Id: String,
  TMute: String,
  VMute: String,
  Jail: String,
  YtSay: String,
  JoinLeave: String,
  Register: String,
  VoiceJL: String,
  VoiceUp: String,
  Tag: String,
  Rol: String,
  PrivateRoomSystem: String
}));

module.exports = schema;