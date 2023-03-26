const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
  name: "come",
  description: "Kullanıcıyı yanınıa çekersiniz.",
  category: "User",
  aliases: ["çek", "getir"], 
  run: async (client, message, args, EmojiData, LogData, Config, RolData) => {
    let Emb = new MessageEmbed({
      color: "BLACK",
      author: {
        name: "Come",
        icon_url: message.author.avatarURL({ dynamic: true })
      },
    });
    let Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!message.member.voice.channel) return message.channel.send({ embeds: [Emb.setDescription("İşlem için bir sesli kanala bağlanmak zorundasın.")] }).Delete(4);
    if(!Member) return message.channel.send({ embeds: [Emb.setDescription("İşlem için bir kullanıcı veya ID belirtmek zorundasın.")] }).Delete(4);
    if(!Member.voice.channel) return message.channel.send({ embeds: [Emb.setDescription("Belirttiğin kullanıcı ses kanallarına bağlı değil.")] }).Delete(4);
    if(message.member.voice.channel.id === Member.voice.channel.id) return message.channel.send({ embeds: [Emb.setDescription("Belirttiğin kullanıcı ile aynı odadasın")] }).Delete(4);
    if(!Member.voice.channel.permissionsFor(message.author.id).has("VIEW_CHANNEL")) return message.channel.send({ embeds: [Emb.setDescription("Belirttiğin kullanıcı ses kanallarına bağlı değil")] }).Delete(4)
    let Onay = new MessageButton().setStyle("SUCCESS").setEmoji(EmojiData.Onay).setCustomId("onay");
    let Ret = new MessageButton().setStyle("DANGER").setEmoji(EmojiData.Ret).setCustomId("ret");
    let Yönetici = new MessageButton().setStyle("SECONDARY").setEmoji(EmojiData.Moderator).setCustomId("yönetici").setDisabled(Config.Roles.Authorized.Management.map(x => x).some(ID => !message.member.roles.cache.has(ID)) && !message.member.permissions.has("ADMINISTRATOR") ? true : false);
    let Msg = await message.channel.send({content: `${Member}` , embeds: [Emb.setDescription(`Selam \`${Member.displayName}\`, ${message.author} kullanıcısı sizi bulunduğu <#${message.member.voice.channel.id}> kanalına çekmek istiyor.(Kalan Süre: <t:${Math.floor((Date.now()+1000*30) / 1000)}:R>)`)], components: [new MessageActionRow().addComponents(Onay, Yönetici, Ret)] });
    
    const collector = await Msg.createMessageComponentCollector({
      componentType: 'BUTTON',
      filter: (component) => [message.author.id, Member.id].some(ID => component.user.id === ID),
      time: 1000*30
    });
    
    collector.on('collect', async(i) => {
      await i.deferUpdate()
      if (i.customId === 'onay') {
        if(i.user.id !== Member.id) return;
        message.react(client.SearchEmojis(EmojiData.Onay)).catch(() => {})
        await Member.voice.setChannel(message.member.voice.channel.id)
        await Msg.delete().catch(() => {})
      };
      if (i.customId === 'ret') {
        if(i.user.id !== Member.id) return;
        message.react(client.SearchEmojis(EmojiData.Onay)).catch(() => {})
        await Msg.delete().catch(() => {})
      };
      if (i.customId === 'yönetici') {
        if(i.user.id !== message.author.id) return;
        message.react(client.SearchEmojis(EmojiData.Onay)).catch(() => {})
        await Member.voice.setChannel(message.member.voice.channel.id)
        await Msg.delete().catch(() => {})
      };
    });

    collector.on('end', async(collected) => {
      await Msg.delete().catch(() => {})
    })
  }
};