const Mongoose = require('mongoose');
const Shema = new Mongoose.Schema({
  _Id: String,
  Punish: { type: Array, default: [] },
  Names: { type: Array, default: [] },
  Invitees: { type: String, default: "" },
  Invited: {
    Total: [],
    Leave: [],
    Regular: [],
    Fake: []
  },
  Voice: { type: Array, default: [] },
  Roles: { type: Array, default: [] },
  Voice_Stats: { 
    Total: [],
    Afk: [],
    Stream: [],
  },
  Message_Stats: {
    Total: [],
  },
  Aut_Stats: {
    Tagest: [],
    Confirmed: [],
    Authorized: [],
  },
  Systems: {
    
  }
});

module.exports = Mongoose.model("UserLog", Shema);