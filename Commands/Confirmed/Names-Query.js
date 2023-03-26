const { MessageEmbed, MessageButton, MessageSelectMenu, MessageActionRow } = require('discord.js');
module.exports = {
  name: "isimler",
  description: "Kullanıcı geçmiş isim kontrol komutu.",
  category: "Authorized",
  aliases: ["names", "geçmiş"], 
  run: async (client, message, args, EmojiData, LogData, Config, RolData) => {
    let Emb = new MessageEmbed({
      color: "BLACK",
      author: {
        name: "İsimler",
        icon_url: message.author.avatarURL({ dynamic: true })
      },
    });
    if(message.member.Permissions(Config.Roles.Authorized.Regsiter) === false) return;
    let Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let page = 1, list = await client.NamesQuery(Member, message.guild);
    if(!list || list && !list.length) return message.channel.send({ embeds: [Emb.setDescription("Belirttiğiniz kullanıcının geçmiş bir *kayıt işlemi* bulunamadı.")] }).Delete(3)

    let forth = new MessageButton({ style: "SECONDARY", emoji: global.Emoji.Right, customId: "ileri" });
    let back = new MessageButton({ style: "SECONDARY", emoji: global.Emoji.Left, customId: "geri" });
    let home = new MessageButton({ style: "SECONDARY", emoji: global.Emoji.Home, customId: "anasayfa" });
    let row = new MessageActionRow().addComponents(back, home, forth);
    let MsgEmb = Emb.setDescription(`*${client.SearchEmojis(global.Emoji.Black_Point)} ${Member} kullanıcısının <t:${Math.floor(Date.now() / 1000)}:D> tarihinden önceki kayıt işlemleri.*\n\n ${list.slice(page == 1 ? 0:  page * 10 - 10, page * 10).join("\n")}`);
    let Msg = await message.channel.send({ embeds: [MsgEmb], components: [row] });

    const collector = await Msg.createMessageComponentCollector({
      componentType: 'BUTTON',
      filter: (component) => component.user.id === message.author.id,
      time: 1000*60*5
    });
    
    collector.on('collect', async(i) => {
      await i.deferUpdate()
      if (i.customId == "ileri") {
        if(list.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return; page += 1;
        await Msg.edit({ embeds: [MsgEmb.setColor("BLACK").setDescription(list.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n"))], components: [row] });
      };
      if (i.customId === 'geri') {
        if(page <= 1 || list.slice((page - 1) * 10 - 10, (page + 1) * 10).length <= 0) return; page -= 1;
        await Msg.edit({ embeds: [MsgEmb.setColor("BLACK").setDescription(list.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n"))], components: [row] });
      };
      if (i.customId === 'anasayfa') {
        page = 1
        await Msg.edit({ embeds: [Emb.setColor("BLACK").setDescription(`*${client.SearchEmojis(global.Emoji.Black_Point)} ${Member} kullanıcısının <t:${Math.floor(Date.now() / 1000)}:D> tarihinden önceki isim işlemleri.*\n\n ${list.slice(0, 10).join("\n")}`)], components: [row] })
      }
    }) 
    collectorMenüs.on('end', async(i) => {
      await Msg.delete().catch(() => {});
      await message.react(client.SearchEmojis(EmojiData.Ret)).catch(() => {});
    });
  }
};