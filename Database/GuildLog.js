const Mongoose = require('mongoose');

const Shema = new Mongoose.Schema({
  _Id: String,
  Punish: { type: Array, default: [] },
  ActivityPunish: { type: Array, default: [] },
  Afk: { type: Array, default: [] },
  Register: { type: Array, default: [] },
  UnRegister: { type: Array, default: [] },
  BannedTag: { type: Array, default: [] },
  BannedUsers: { type: Array, default: [] },
  TopLoad: { type: Object, default: {} },
  PrivarteSystem: { type: Boolean, default: false },
  PrivarteSystemChannels: { type: Array, default: [] },
  PrivarteSystemVoiceChannel: { type: String, default: "" },
  PrivarteSystemChatChannel: { type: String, default: "" },
  PrivarteSystemCategory: { type: String, default: "" },
});

module.exports = Mongoose.model("GuildLog", Shema);