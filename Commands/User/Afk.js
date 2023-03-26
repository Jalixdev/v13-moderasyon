const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const GuildLog = require('../../Database/GuildLog');

module.exports = {
  name: "afk",
  description: "Afk moduna girersiniz.",
  category: "User",
  aliases: ["kaçtımbb", "byee"], 
  run: async (client, message, args, EmojiData, LogData, Config, RolData) => {
    if(message.member.displayName.startsWith("{afk}")) return;
    client.MsgCheck(message);
    await message.react(client.SearchEmojis(EmojiData.Onay))
    await message.reply({ content: "Başarılı Bir Şekilde AFK Moduna Girdin. Herhangi bir kanala birşey yazana kadar afk sayılıcaksın." }).Delete(3);
    await GuildLog.findOneAndUpdate({ _Id: message.guild.id }, { $push: { "Afk": { _Id: message.member.id,  Date: Date.now(), Reason: args.join(' '), Status: true, Pings: [] }}},{ upsert: true, new: true, setDefaultsOnInsert: true });
    if(message.member.manageable) message.member.setNickname(`{afk} ${message.member.displayName}`).catch(() => {});
  }
};