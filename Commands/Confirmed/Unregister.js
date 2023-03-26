const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
module.exports = {
  name: "kayıtsız",
  description: "Kullanıcıyı kayıtsıza atarsınız.",
  category: "Authorized",
  aliases: ["unregister", "unreg", "orospu"], 
  run: async (client, message, args, EmojiData, LogData, Config, RolData) => {
    let Emb = new MessageEmbed({
      color: "BLACK",
      author: {
        name: "Kayıt",
        icon_url: message.author.avatarURL({ dynamic: true })
      },
    });
    if(message.member.Permissions(Config.Roles.Authorized.Register) === false) return;
    let Member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!Member) return message.channel.send({ embeds: [Emb.setDescription("Kayıt işlemi için bir kullanıcı veya ID belirtmek zorundasın.")] }).Delete(3);
    if((Member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerId ) || Member.id === message.guild.ownerId  || !Member.manageable || Member.id === message.author.id ) return message.channel.send({ embeds: [Emb.setDescription(`${Member.id === message.guild.ownerId ? "İşlem için belirttiğiniz kullanıcı sunucu sahibi bence fazla zorlama 😬" : message.author.id === Member.id ? "Ne yazık ki kendine işlem uygulayamazsın." : !Member.manageable ? "Belirttiğin kullanıcıya işlem yapmaya ne yazık ki yetkim yetmiyor." : Member.roles.highest.position > message.member.roles.highest.position ? "Belirttiğiniz kullanıcı sizden üst yetkide." : "Belirttiğin kullanıcı ile aynı yetkide bulunuyorsun."}`)] }).Delete(4);
    await message.react(client.SearchEmojis(EmojiData.Onay)).catch(() => {});
    if(Member.nameCheck() === true) {
      let yes = new MessageButton({ style: "SECONDARY", emoji: global.Emoji.Onay, customId: "e" });
      let no = new MessageButton({ style: "SECONDARY", emoji: global.Emoji.Ret, customId: "h" });
      let row = new MessageActionRow().addComponents(yes, no);
      let Msg = await message.reply({ content: Member.user.tag + " isimli **taglı** kullanıcıyı kayıtsıza atmak istediğinize eminmisiniz?", components: [row] });
      const collector = await Msg.createMessageComponentCollector({
        componentType: 'BUTTON',
        filter: (component) => component.user.id === message.author.id,
        time: 1000*60*5
      });
      collector.on('collect', async(i) => {
        await i.deferUpdate()
        if(i.customId === "e") {
          await client.UnRegister(Member, message.member, message.guild, "Komut ile Taglı Üyeyi Kayıtsıza Atma");
          await Msg.delete().catch(() => {});
        } else {
          await Msg.delete().catch(() => {});
        }
      });
    } else {
      await client.UnRegister(Member, message.member, message.guild, "Komut ile Tagsız Üyeyi Kayıtsıza Atma")
    }
  }
};
