const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require('discord.js');
const UserLog = require('../../Database/UserLog');
const GuildLog = require('../../Database/GuildLog');

module.exports = {
  name: "ban",
  description: "Kullanıcı sunucudan yasaklarsınız.",
  category: "Admin",
  aliases: ["sg", "yasakla", "amantanrımdidim", "ananısikim"], 
  run: async (client, message, args, EmojiData, LogData, Config, RolData) => {
    let Emb = new MessageEmbed({
      color: "BLACK",
      author: {
        name: "Yasaklama",
        icon_url: message.author.avatarURL({ dynamic: true })
      },
    });
    if(message.member.Permissions(Config.Roles.Authorized.For) === false) return;
    let Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || client.api.users[args[0]].get();
    if(!Member) return message.channel.send({ embeds: [Emb.setDescription("Yasaklama işlemi için bir kullanıcı veya ID belirtmek zorundasın.")] }).Delete(3);
    if((Member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerId ) || Member.id === message.guild.ownerId  || !Member.manageable || Member.id === message.author.id ) return message.channel.send({ embeds: [Emb.setDescription(`${Member.id === message.guild.ownerId ? "İşlem için belirttiğiniz kullanıcı sunucu sahibi bence fazla zorlama 😬" : message.author.id === Member.id ? "Ne yazık ki kendine işlem uygulayamazsın." : !Member.manageable ? "Belirttiğin kullanıcıya işlem yapmaya ne yazık ki yetkim yetmiyor." : Member.roles.highest.position > message.member.roles.highest.position ? "Belirttiğiniz kullanıcı sizden üst yetkide." : "Belirttiğin kullanıcı ile aynı yetkide bulunuyorsun."}`)] }).Delete(4);
    let Reason = args.slice(1).join(" ") || "Sebep Belirtilmedi";
    await message.react(client.SearchEmojis(EmojiData.Onay)).catch(() => {});
    await message.channel.send({ content: ` ${Member.user ? Member.user.username : Member.username} kullanıcısı kallıcı olarak sunucudan yasaklandı! Kaldırmak için lütfen bot sahibine ulaşınız.` });
    await client.AddPunish("ForceBan", message.guild, Member, message.member, "Süresiz", Reason, undefined, [])
  }
};