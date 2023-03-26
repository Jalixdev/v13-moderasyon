module.exports = {
  name: "kilit",
  aliases: ['lock'], 
  run: async (client, message, args, EmojiData, LogData, Config, RolData) => {
    if(message.member.Permissions(Config.Roles.Authorized.Management) === false) return;
    let Everyone = message.guild.roles.cache.find(a => a.name === "@everyone");
    if (message.channel.permissionsFor(Everyone).has('SEND_MESSAGES')) {
      message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SEND_MESSAGES: false });
      message.react(client.SearchEmojis(EmojiData.Off_Text)).catch(() => {});
      message.reply({ content: `${client.SearchEmojis(EmojiData.Off_Text)} ${message.channel} kanalı başarıyla tarafınızca(**${message.author.tag}**) kilidi __kapatıldı__.` }).Delete(5);
    } else {
      message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SEND_MESSAGES: true });
      message.react(client.SearchEmojis(EmojiData.On_Text)).catch(() => {});
      message.reply({ content: `${client.SearchEmojis(EmojiData.On_Text)} ${message.channel} kanalı başarıyla tarafınızca(**${message.author.tag}**) kilidi __açıldı__.` }).Delete(5);
    }
  }
};