module.exports = {
  name: "clear",
  description: "Belirtilen kanaldaki mesajları siler.",
  category: "Admin",
  aliases: ['sil'], 
  run: async (client, message, args, EmojiData, LogData, Config, RolData) => {
    if(message.member.Permissions(Config.Roles.Authorized.Management) === false) return;
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(x=> x.name == args[0]) || message.channel;
    if(!args[0] && isNaN(args[0])) return message.react(client.SearchEmojis(EmojiData.Ret)).catch(() => {});
    await message.delete().catch(() => {})
    channel.bulkDelete(isNaN(args[0]) ? args[1] : args[0]).then(() => {
      message.channel.send({ content: `🗑️ ${channel} kanalında ${isNaN(args[0]) ? args[0] : args[1]} adet mesaj sildim!` }).Delete(3)
    }).catch(err =>  message.react(client.SearchEmojis(EmojiData.Error)).catch(() => {}))
  }
};