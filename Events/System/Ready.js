const Invite = require('../../Database/Invite');
const { joinVoiceChannel } = require('@discordjs/voice');
const Client = global.client;
const Emoji = require('../../Database/GuildEmojiManager');
const Log = require('../../Database/GuildLogManager');
const Rol = require('../../Database/GuildRolManager');
const GuildLog = require('../../Database/GuildLog');

module.exports = async() => {
    let LogData = global.Log = await Log.findOne({ _Id: global.Config.Guild.Id })
    let EmojiData = global.Emoji = await Emoji.findOne({ _Id: global.Config.Guild.Id })
    let RolData = global.Rol = await Rol.findOne({ _Id: global.Config.Guild.Id })
  Client.user.setPresence({ activities: [{ name: "Created By Jalix." }], status: "dnd" });
  Connect();
  setInterval(() => {
    Connect();
  }, 1000*60*60);
  Client.guilds.cache.forEach(async(guild) => {
    let inviting = (await guild.invites.fetch()).map(i => [i.code, i.uses]);  
    Invite[guild.id] = new Map(inviting);
  });
  Client.on("inviteCreate", invite => { 
    Invite[invite.guild.id].set(invite.code, invite.uses);
  });
  Client.on("inviteDelete", invite => { 
    Invite[invite.guild.id].delete(invite.code);
  });
}
function Connect() {
  let Channel = Client.channels.cache.get(global.Config.Channels.Voice);    
 // if(Channel && (Client.guilds.cache.first().members.cache.get(Client.user.id).voice.channelId != null  &&  Client.guilds.cache.first().members.cache.get(Client.user.id).voice.channelId !== Channel.id)) {
    joinVoiceChannel({
      channelId: Channel.id,
      guildId: Channel.guild.id,
      adapterCreator: Channel.guild.voiceAdapterCreator,
      selfMute: true
    });
  //};
}