const { MessageEmbed, MessageButton, MessageSelectMenu, MessageActionRow } = require('discord.js');

module.exports = {
  name: "log",
  description: "Belirtilen kullanıcının sunucu içi loglarını görüntülersiniz.",
  category: "Authorized",
  aliases: ["rollog", "seslog", "işlemler"],
  run: async (client, message, args, EmojiData, LogData, Config, RolData) => {
    let Emb = new MessageEmbed({
      color: "BLACK",
      author: {
        name: "Log",
        icon_url: message.author.avatarURL({ dynamic: true })
      },
    });
    if(message.member.Permissions(Config.Roles.Authorized.Management) === false) return;
    let Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let Menü = new MessageSelectMenu()
    .setCustomId("check")
    .setPlaceholder("Seçiniz!")
    .addOptions([
      {label: "Ses Geçmişi", value:"ses"},
    ]);
    let row = new MessageActionRow().addComponents(Menü);
    let Msg = await message.channel.send({ components: [row] });
    const collector = await Msg.createMessageComponentCollector({
      componentType: 'SELECT_MENU',
      filter: (component) => component.user.id === message.author.id,
      time: 1000*60
    });
        
    collector.on('collect', async(i) => {
      if(i.values[0] === "ses") {
        let list = await client.VoiceLogQuery(Member, message.guild);
        if(!list || list && !list.length) return message.reply({ content: "Kullanıcı verisi bulunamadı", ephemeral: true });
        await i.deferUpdate();      
        ListString(list)
      }
    });
    
    async function ListString(list) {
      let page = 1
      let forth = new MessageButton({ style: "SECONDARY", emoji: global.Emoji.Right, customId: "ileri" });
      let back = new MessageButton({ style: "SECONDARY", emoji: global.Emoji.Left, customId: "geri" });
      let home = new MessageButton({ style: "SECONDARY", emoji: global.Emoji.Home, customId: "anasayfa" });
      let row = new MessageActionRow().addComponents(back, home, forth);
      let MsgEmb = Emb.setDescription(`*${client.SearchEmojis(global.Emoji.Black_Point)} ${Member} kullanıcısının <t:${Math.floor(Date.now() / 1000)}:D> tarihinden önceki ses işlemleri.*\n\n ${list.slice(page == 1 ? 0:  page * 10 - 10, page * 10).join("\n")}`);
      Msg = await Msg.edit({ embeds: [MsgEmb], components: list.length > 10 ? [row] : [] });
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
          await Msg.edit({ embeds: [Emb.setColor("BLACK").setDescription(`*${client.SearchEmojis(global.Emoji.Black_Point)} ${Member} kullanıcısının <t:${Math.floor(Date.now() / 1000)}:D> tarihinden önceki işlemleri.*\n\n ${list.slice(0, 10).join("\n")}`)], components: [row] })
        };
      }) 
    }
  }
};
