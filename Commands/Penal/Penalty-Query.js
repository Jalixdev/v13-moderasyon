const { MessageEmbed, MessageButton, MessageSelectMenu, MessageActionRow } = require('discord.js');
const GuildLog = require('../../Database/GuildLog');
module.exports = {
  name: "sicil",
  description: "Kullanıcı geçmiş ceza kontrol komutu.",
  category: "Authorized",
  aliases: ["record", "query"], 
  run: async (client, message, args, EmojiData, LogData, Config, RolData) => {
    let Emb = new MessageEmbed({
      color: "BLACK",
      author: {
        name: "Sicil",
        icon_url: message.author.avatarURL({ dynamic: true })
      },
    });
    if(message.member.Permissions(Config.Roles.Authorized.Punish) === false) return;
    let Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!Member) {
      
      let GuildData = await GuildLog.findOneAndUpdate({ _Id: message.guild.id }, { $set: { _Id: message.guild.id }},{ upsert: true, new: true, setDefaultsOnInsert: true });
      let veri = GuildData.Punish.find(x => x._Id.toString() === args[0]);
      if(!veri) return message.channel.send({ embeds: [Emb.setDescription(`${args[0] ? isNaN(args[0]) === false ? "Belirttiğiniz ceza numarasına ait veri bulunamadı." : "Sicil işlemi için geçerli bir kullanıcı veya ID belirtmek zorundasın." : "Sicil işlemi için geçerli bir kullanıcı veya ID belirtmek zorundasın."} `)] }).Delete(3);
      await message.channel.send({
          content: " ",
          embeds: [Emb.setColor("BLUE").setFooter({ text: veri.Notes ? `Yetkili Notu: ${veri.Notes}`: " " }).setDescription(`[\`#${veri._Id}\`](${veri.LogMsg}) numaraları ceza bilgileri aşağıda verilmiştir.
        \`\`\`ansi
[2;31m[1;31m[1;37m• Ceza Türü:[2;31m[1;31m[1;37m [2;34m${veri.Type.replace("TMute", "Text-Muted.").replace("VMute", "Voice-Muted").replace("Jail", "Jailed")}[0m
[2;31m[1;31m[1;37m• Cezalandıran:[2;31m[1;31m[1;37m [2;34m${message.guild.members.cache.get(veri._Admin).displayName} - (${message.guild.members.cache.get(veri._Admin).id})[0m
[2;31m[1;31m[1;37m• Cezalandırılan:[2;31m[1;31m[1;37m [2;34m${message.guild.members.cache.get(veri._User).displayName} - (${message.guild.members.cache.get(veri._User).id})[0m
[2;31m[1;31m[1;37m• Ceza Sebebi:[2;31m[1;31m[1;37m [2;34m${veri.Reason}[0m
[2;31m[1;31m[1;37m• Ceza Tarihi:[2;31m[1;31m[1;37m [2;34m${new Date(veri.Date).formatDate()}(${client.Time(veri.Time)})[0m\`\`\``)],
        }).Delete(25);
      
    } else {
    
      let page = 1, list = await client.PenaltyQuery(Member, message.guild);
      if(!list || list && !list.length) return message.channel.send({ embeds: [Emb.setDescription("Belirttiğiniz kullanıcının geçmiş bir *ceza-i işlemi* bulunamadı.")] }).Delete(3)
      let Menüs = [];
      for(let e = 0; e < list.length; e += 1) {
        await Menüs.push({label: `${list[e].slice(1).trim().split(/ +/g)[0].replace(":`", "")}`,value: `${list[e].slice(1).trim().split(/ +/g)[0].replace(":`", "").replace("#", "")}`});
      };
      let Menü; Menü = await MenüCreate(Menüs, page);
      let forth = new MessageButton({ style: "SECONDARY", emoji: global.Emoji.Right, customId: "ileri" });
      let back = new MessageButton({ style: "SECONDARY", emoji: global.Emoji.Left, customId: "geri" });
      let home = new MessageButton({ style: "SECONDARY", emoji: global.Emoji.Home, customId: "anasayfa" });
      let row = new MessageActionRow().addComponents(Menü);
      let row2 = new MessageActionRow().addComponents(back, home, forth);
      let MsgEmb = Emb.setDescription(`*${client.SearchEmojis(global.Emoji.Black_Point)} ${Member} kullanıcısının <t:${Math.floor(Date.now() / 1000)}:D> tarihinden önceki ceza-i işlemleri.*\n\n ${list.slice(page == 1 ? 0:  page * 10 - 10, page * 10).join("\n")}`);
      let Msg = await message.channel.send({ embeds: [MsgEmb], components: [row, row2] });
      const collectorMenüs = await Msg.createMessageComponentCollector({
        componentType: 'SELECT_MENU',
        filter: (component) => component.user.id === message.author.id,
        time: 1000*60*5
      });
      const collectorButtons = await Msg.createMessageComponentCollector({
        componentType: 'BUTTON',
        filter: (component) => component.user.id === message.author.id,
        time: 1000*60*5
      });
      collectorButtons.on('collect', async(i) => {
        await i.deferUpdate()
        if (i.customId == "ileri") {
          if(list.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return; page += 1;
          Menü = await MenüCreate(Menüs, page), row = new MessageActionRow().addComponents(Menü);
          await Msg.edit({ embeds: [MsgEmb.setColor("BLACK").setDescription(list.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n"))], components: [row, row2] });
        };
        if (i.customId === 'geri') {
          if(page <= 1 || list.slice((page - 1) * 10 - 10, (page + 1) * 10).length <= 0) return; page -= 1;
          Menü = await MenüCreate(Menüs, page), row = new MessageActionRow().addComponents(Menü);
          await Msg.edit({ embeds: [MsgEmb.setColor("BLACK").setDescription(list.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n"))], components: [row, row2] });
        };
        if (i.customId === 'anasayfa') {
          page = 1, Menü = await MenüCreate(Menüs, page),  row = new MessageActionRow().addComponents(Menü);
          await Msg.edit({ embeds: [Emb.setColor("BLACK").setDescription(`*${client.SearchEmojis(global.Emoji.Black_Point)} ${Member} kullanıcısının <t:${Math.floor(Date.now() / 1000)}:D> tarihinden önceki ceza-i işlemleri.*\n\n ${list.slice(1 * 10 - 10, page * 10).join("\n")}`)], components: [row, row2] })
        }
      })
 
      collectorMenüs.on('collect', async(i) => {
        await i.deferUpdate()
        let GuildData = await GuildLog.findOneAndUpdate({ _Id: message.guild.id }, { $set: { _Id: message.guild.id }},{ upsert: true, new: true, setDefaultsOnInsert: true });
        let Vote = GuildData.Punish.find(x => x._Id == i.values[0]);
        await Msg.edit({
          content: " ",
          embeds: [Emb.setColor("BLUE").setFooter({ text: Vote.Notes ? `Yetkili Notu: ${Vote.Notes}`: " " }).setDescription(`[\`#${Vote._Id}\`](${Vote.LogMsg}) numaraları ceza bilgileri aşağıda verilmiştir.
        \`\`\`ansi
[2;31m[1;31m[1;37m• Ceza Türü:[2;31m[1;31m[1;37m [2;34m${Vote.Type.replace("TMute", "Text-Muted.").replace("VMute", "Voice-Muted").replace("Jail", "Jailed")}[0m
[2;31m[1;31m[1;37m• Cezalandıran:[2;31m[1;31m[1;37m [2;34m${message.guild.members.cache.get(Vote._Admin).displayName} - (${message.guild.members.cache.get(Vote._Admin).id})[0m
[2;31m[1;31m[1;37m• Ceza Sebebi:[2;31m[1;31m[1;37m [2;34m${Vote.Reason}[0m
[2;31m[1;31m[1;37m• Ceza Tarihi:[2;31m[1;31m[1;37m [2;34m${new Date(Vote.Date).formatDate()}(${client.Time(Vote.Time)})[0m\`\`\``)],
        });
      });    
    };
   /* collectorMenüs.on('end', async(i) => {
      await Msg.delete().catch(() => {});
      await message.react(client.SearchEmojis(EmojiData.Ret)).catch(() => {});
    });*/
  }
};
async function MenüCreate(Arr, page) {
  let Menü = await new MessageSelectMenu()
  .setCustomId(page.toString())
  .setPlaceholder("Kontrol Etmek İçin Seçiniz!")
  .addOptions(Arr.slice(page == 1 ? 0:  page * 10 - 10, page * 10));
  return Menü;
};