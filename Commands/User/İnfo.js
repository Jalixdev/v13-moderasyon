const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const fetch = require('node-fetch')
module.exports = {
  name: "userinfo",
  aliases: ['info', "kullanıcıbilgi", "kb"], 
  run: async (client, message, args, EmojiData, LogData, Config, RolData) => {
    let Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let uid = Member.id
    let response = fetch(`https://discord.com/api/v10/users/${uid}`, {
      method: 'GET',
      headers: {
        Authorization: `Bot ${client.token}`
      }
    });
    let receive = ''
    var banner = 'https://cdn.discordapp.com/attachments/829722741288337428/834016013678673950/banner_invisible.gif' // invisible image ( you can change the link if you want )

    response.then(a => {
      if(a.status !== 404) {
        a.json().then(data => {
          receive = data['banner']
          if(receive !== null) {
            let format = 'png'
            if(receive.substring(0,2) === 'a_') {
              format = 'gif'
            }
            banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.${format}?size=1024`
          };
        });
      };
    });
    setTimeout(async() => {
      let Avatar = new MessageButton().setStyle("LINK").setURL(Member.user.avatarURL()).setLabel("Avatar").setDisabled(Member.user.avatar === undefined ? true : false);
      let Banner = new MessageButton().setStyle("LINK").setURL(banner).setLabel("Banner").setDisabled(banner === "https://cdn.discordapp.com/attachments/829722741288337428/834016013678673950/banner_invisible.gif" ? true : false);
      let Presence = {online: client.SearchEmojis(EmojiData.Online), offline: client.SearchEmojis(EmojiData.Offline), dnd: client.SearchEmojis(EmojiData.Dnd), idle: client.SearchEmojis(EmojiData.İdle)}
      await message.channel.send({ embeds: [new MessageEmbed({
        author: {
          name: Member.user.tag,
          icon_url: Member.user.avatarURL({ dynamic: true })
        },
        color: "DARK_BLUE",
        description: `👤 **Kullanıcı Bilgisi**
${client.SearchEmojis(EmojiData.Reply)} Rozetleri: \` Rozet Bulunamadı! \`
${client.SearchEmojis(EmojiData.Reply)} Durumu: ${Member.presence === null ?  `${client.SearchEmojis(EmojiData.Offline)} Çevrimdışı` : `${Member.presence ? Presence[Member.presence.status]: client.SearchEmojis(EmojiData.Offline)} ${Member.presence.activities.filter(x => x.name !== "Custom Status").map(x => "__" + x.name + "__ **" + x.type.replace("PLAYING", "Oynuyor!**").replace("STREAMING", "Yayında!**").replace("LISTENING", "Dinliyor!**").replace("WATCHING", "İzliyor!**"))}`} 
${client.SearchEmojis(EmojiData.Reply)} ID: \`${Member.id}\`
${client.SearchEmojis(EmojiData.Reply)} Kullanıcı Adı: \`${Member.user.username}\`
${client.SearchEmojis(EmojiData.Reply)} Oluşturulma Tarihi:  <t:${Math.floor(Member.user.createdTimestamp / 1000)}:f> 
(\`${client.Time(Date.now() - Member.user.createdTimestamp)}\`)
${client.SearchEmojis(EmojiData.Reply)} Bağlandığı Cihaz: ${Member.presence !== null ? Object.keys(Member.presence.clientStatus).map(x => x.replace("desktop", "`🖥️ PC (APP)`").replace("mobile", "`📱 Phone`").replace("web", "`� WEB`")).join(", ") : "`Çevrimdışı`"}
📂 **Üye Bilgisi**
${client.SearchEmojis(EmojiData.Reply)} Sunucu Adı: \`${Member.nickname || "Bulunmuyor!"}\`
${client.SearchEmojis(EmojiData.Reply)} Ceza Puanı \`0\`
${client.SearchEmojis(EmojiData.Reply)} Katılma Tarihi&Sırası: <t:${Math.floor(Member.joinedTimestamp / 1000)}:f> - \`${(message.guild.members.cache.filter(a => a.joinedTimestamp <= Member.joinedTimestamp).size).toLocaleString()}/${(message.guild.memberCount).toLocaleString()}\`
(\`${client.Time(Date.now() - Member.joinedTimestamp)}\`)
${client.SearchEmojis(EmojiData.Reply)} Rolleri(**${Member._roles.length}**): ${Member._roles.length > 10 ? "`Görüntülenemedi!`" : Member._roles.map(x => `<@&${x}>`).join(", ")}`,
       /* thumbnail: { 
          url: Member.user.avatarURL({ dynamic: true })
        },*/
        image: {
          url: banner,
        },
        footer: {
          text: `${Member.presence === null ? "" : `${Member.presence.activities.find(x => x.state) === undefined ? `` : `${Member.presence.activities.find(x => x.state).state}`}`}`
        }
      })], components: [new MessageActionRow().addComponents(Avatar, Banner)] });
    }, 500)
  }
};