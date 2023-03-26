const { MessageEmbed, MessageButton, MessageSelectMenu, MessageActionRow } = require('discord.js');
const UserLog = require('../../Database/UserLog');
const GuildLog = require('../../Database/GuildLog');

module.exports = {
  name: "remove",
  description: "Kullanıcı ceza kaldırma komutu.",
  category: "Authorized",
  aliases: ["removepunish", "unpunish"], 
  run: async (client, message, args, EmojiData, LogData, Config, RolData) => {
    let Emb = new MessageEmbed({
      color: "BLACK",
      author: {
        name: "Ceza Kaldırma",
        icon_url: message.author.avatarURL({ dynamic: true })
      },
    });
    if(message.member.Permissions(Config.Roles.Authorized.Punish) === false) return;
    let Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!Member) return message.channel.send({ embeds: [Emb.setDescription("Ceza Kaldırma işlemi için bir kullanıcı veya ID belirtmek zorundasın.")] }).Delete(3);
    if((Member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerId ) || Member.id === message.guild.ownerId  || !Member.manageable || Member.id === message.author.id ) return message.channel.send({ embeds: [Emb.setDescription(`${Member.id === message.guild.ownerId ? "İşlem için belirttiğiniz kullanıcı sunucu sahibi bence fazla zorlama 😬" : message.author.id === Member.id ? "Ne yazık ki kendine işlem uygulayamazsın." : !Member.manageable ? "Belirttiğin kullanıcıya işlem yapmaya ne yazık ki yetkim yetmiyor." : Member.roles.highest.position > message.member.roles.highest.position ? "Belirttiğiniz kullanıcı sizden üst yetkide." : "Belirttiğin kullanıcı ile aynı yetkide bulunuyorsun."}`)] }).Delete(4);

    let UserData = await UserLog.findOneAndUpdate({ _Id: Member.id }, { $set: { _Id: Member.id }},{ upsert: true, new: true, setDefaultsOnInsert: true });
    let GuildData = await GuildLog.findOneAndUpdate({ _Id: message.guild.id }, { $set: { _Id: message.guild.id }},{ upsert: true, new: true, setDefaultsOnInsert: true });
    let ActiveList = GuildData.ActivityPunish;
    let User = await ActiveList.filter(x => x._User === Member.id);
    if(!User || !User.length) return message.channel.send({ content: "Kullanıcının aktif bir cezası bulunamadı." }).Delete(3)
      
    let Menüs = [];
    for(let e = 0; e < User.length; e += 1) {
      Menüs.push({label: `#${User[e]._Id} ` + { TMute: "Yazı Kanallarından Uzaklaştırma", VMute: "Sesli Kanallardan Uzaklaştırma", Jail: "Sunucudan Uzaklaştırma" }[User[e].Type],value: `${User[e]._Id}`, description: User[e].Reason ,emoji: { TMute: client.SearchEmojis(global.Emoji.Off_Text), VMute: client.SearchEmojis(global.Emoji.Off_Voice), Jail: client.SearchEmojis(global.Emoji.Jail) }[User[e].Type]});
    };
    let Menü = new MessageSelectMenu()
    .setCustomId("punish")
    .setPlaceholder("Kaldırmak istediğiniz cezayı seçiniz!")
    .addOptions(Menüs)
    let row = new MessageActionRow().addComponents(Menü);
    let Msg = await message.channel.send({ 
      content: "Kullanıcının aktif cezaları aşağıda listelenmiş durumda. Kaldırmak istediğiniz cezayı seçtikten sonra bilgi alabilirsiniz.", 
      components: [row] 
    });
       
    const collectorMenüs = await Msg.createMessageComponentCollector({
      componentType: 'SELECT_MENU',
      filter: (component) => component.user.id === message.author.id,
      time: 1000*60*2
    });
    const collectorButtons = await Msg.createMessageComponentCollector({
      componentType: 'BUTTON',
      filter: (component) => component.user.id === message.author.id,
      time: 1000*60*2
    });
    
    collectorMenüs.on('collect', async(i) => {
      await i.deferUpdate();
      let Vote = await User.find(x => x._Id === Number(i.values[0]));
      let Remove = new MessageButton({ style: "PRIMARY", label: "Cezayı Kaldırmak İçin Tıkla", customId: "remove" });
      let row = new MessageActionRow().addComponents(Remove);
      await Msg.edit({
        content: " ",
        embeds: [Emb.setThumbnail(Member.displayAvatarURL({ dynamic: true })).setColor("BLUE").setFooter({ text: Vote.Notes ? `Yetkili Notu: ${Vote.Notes}`: " " }).setDescription(`[\`#${Vote._Id}\`](${Vote.LogMsg}) numaraları ceza bilgileri aşağıda verilmiştir.
        \`\`\`ansi
[2;31m[1;31m[1;37m• Ceza Türü:[2;31m[1;31m[1;37m [2;34m${Vote.Type.replace("TMute", "Text-Muted.").replace("VMute", "Voice-Muted").replace("Jail", "Jailed")}[0m
[2;31m[1;31m[1;37m• Cezalandıran:[2;31m[1;31m[1;37m [2;34m${message.guild.members.cache.get(Vote._Admin).displayName} - (${message.guild.members.cache.get(Vote._Admin).id})[0m
[2;31m[1;31m[1;37m• Ceza Sebebi:[2;31m[1;31m[1;37m [2;34m${Vote.Reason}[0m
[2;31m[1;31m[1;37m• Ceza Tarihi:[2;31m[1;31m[1;37m [2;34m${new Date(Vote.Date).formatDate()}(${client.Time(Vote.Time)})[0m\`\`\``)],
        components: [row]
      })
          
      collectorButtons.on('collect', async(e) => {
        await e.deferUpdate();
        await client.RemovePunish(i.values[0], message.guild, Member, message.member)
        await Msg.delete().catch(() => {})
        await message.react(client.SearchEmojis(EmojiData.Onay)).catch(() => {})
      })
    });
        
  /*  collectorMenüs.on('end', async(i) => {
      await Msg.delete().catch(() => {});
      await message.react(client.SearchEmojis(EmojiData.Ret)).catch(() => {});
    });*/
  }
};