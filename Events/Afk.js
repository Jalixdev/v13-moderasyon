const { MessageEmbed } = require('discord.js');
const GuildLog = require('..//Database/GuildLog');
const client = global.client;

module.exports = async message => {
    if (!message.guild || message.author.bot || message.content.startsWith(".afk") || client.commands.find(x => x.name == "afk").aliases.map(x => `.${x}`).some(AFK => message.content.startsWith(AFK))) return;
    let Member = message.mentions.members.first();
    let Guild = (await GuildLog.findOneAndUpdate({ _Id: message.guild.id }, { $set: { _Id: message.guild.id }},{ upsert: true, new: true, setDefaultsOnInsert: true })).Afk;
    let UserControl = Guild.find(x => x._Id === message.member.id && x.Status === true);
    if(Member) {
      let veri = Guild.find(x => x._Id === Member.id && x.Status === true);
      if(!veri) return;
      veri.Pings.push({ User: message.member, Content: message.content, Date: Date.now(), MessageURL: message.url })
        if(veri) {
            await message.react(client.SearchEmojis(global.Emoji.Afk));
            await message.reply({ embeds: [new MessageEmbed({ 
                color: "PURPLE",
                description: `${Member} kullanıcısı <t:${Math.floor(veri.Date / 1000)}:R> önce ${veri.Reason ? `**${veri.Reason}** sebebiyle ` : ""}**AFK** oldu!`
            })] }).Delete(3);
        }
    };
    if(UserControl) {
      message.reply({ content: "Hoşgeldin artık AFK değilsin!", ephemeral: true }).Delete(3);
      if(UserControl.Pings.length) {
        let PingsList = UserControl.Pings.map((Data, index) => `\`${index+1} - )\` **[[Mesaja Git.](${Data.MessageURL})]** ${message.guild.members.cache.get(Data.User)} -  __<t:${Math.floor(Data.Date / 1000)}:f>__\n\`Mesaj İçeriği:\`  **${Data.Content}**`)
        message.member.send({ content: "**AFK** süresi içinde sana gelen etiketlere aşağıdan bakabilirsin", embeds: [new MessageEmbed({
          color: "GREEN",
          description: `${PingsList.join("\n")}`
        })] }).catch(() => {});
      }
      let arr = Guild.filter(x => x._Id !== message.member.id)
      await GuildLog.updateOne({ _Id: global.Config.Guild.Id }, { $set: { Afk: arr } });  
      if(message.member.manageable) message.member.setNickname(message.member.displayName.replace("{afk} ", "")).catch(e => {});
    };
}
