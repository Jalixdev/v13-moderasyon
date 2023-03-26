module.exports = async() => {
  Control()
  setInterval(() => {
    Control()
  }, 10000);
}
async function Control() {
  const client = global.client;
  
  const GuildLog = require('../Database/GuildLog');
  const GuildData = await GuildLog.findOne({ _Id: global.Config.Guild.Id });
  if(!GuildData) return;
  let Arr = GuildData.ActivityPunish
  
  Arr.filter(x => Date.now() < x.Finish).forEach(data => {
    if(!data) return;
    let Member = client.guilds.cache.get(global.Config.Guild.Id).members.cache.get(data._User);
    if(!Member) return;
    if(data.Type === "Jail" && (Member._roles && !Member.roles.cache.has(global.Config.Roles.Suspensed.Jail))) Member.setRoles(global.Config.Roles.Suspensed.Jail);
    if(data.Type === "TMute" && (Member._roles && !Member.roles.cache.has(global.Config.Roles.Suspensed.TextMuted))) Member.roles.add(global.Config.Roles.Suspensed.TextMuted).catch(() => {});
    if(data.Type === "VMute" && (Member._roles && !Member.roles.cache.has(global.Config.Roles.Suspensed.VoiceMuted)) || Member.voice.serverMute === false) Member.roles.add(global.Config.Roles.Suspensed.VoiceMuted).catch(() => {}); if(Member.voice.channel) Member.voice.setMute(true, data.Reason);
  })
  Arr.filter(x => Date.now() > x.Finish).forEach(async (data) => {
    if(!data) return;
    let Member = client.guilds.cache.get(global.Config.Guild.Id).members.cache.get(data._User);
    if(!Member) return;
    if(data.Type === "Jail") {
      Member.setRoles(global.Config.Roles.General.Unregister);
    };
    if(data.Type === "TMute") {
      Member.roles.remove(global.Config.Roles.Suspensed.TextMuted);
    };
    if(data.Type === "VMute") {
      Member.roles.remove(global.Config.Roles.Suspensed.VoiceMuted).catch(() => {});
      if(Member.voice.channel) Member.voice.setMute(false, data.Reason); 
    }
    Arr = await Arr.filter(x => x !== data)
    await GuildLog.updateMany({ _Id: global.Config.Guild.Id }, { $set: { ActivityPunish: Arr } });  
  })
}