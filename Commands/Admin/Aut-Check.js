const { MessageEmbed, MessageButton, MessageSelectMenu, MessageActionRow } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals');
module.exports = {
  name: "staff",
  description: "Sunucu içi yetkili kontrolü yaparsınız.",
  category: "Admin",
  aliases: ["ysay", 'staffsay', "yetkilikontrol"], 
  run: async (client, message, args, EmojiData, LogData, Config, RolData) => {
    let Emb = new MessageEmbed({
      color: "BLACK",
      author: {
        name: message.guild.name,
        icon_url: message.guild.iconURL({ dynamic: true })
      },
    });
    
    if(message.member.Permissions(Config.Roles.Authorized.Management) === false) return;
        
    const Users = await message.guild.members.cache.filter(member => member.roles.highest.position >= message.guild.roles.cache.get(Config.Roles.Authorized.MinStaffRole).position && member.nameCheck() === true && !member.user.bot);
    const Presence = {online: client.SearchEmojis(EmojiData.Online), offline: client.SearchEmojis(EmojiData.Offline), dnd: client.SearchEmojis(EmojiData.Dnd), idle: client.SearchEmojis(EmojiData.İdle)}
    
    let Menü = new MessageSelectMenu()
    .setCustomId("check")
    .setPlaceholder("Seçiniz!")
    .addOptions([
      {label: "Tüm Yetkililer", value:"all", description: "Sunucu içindeki tüm yekilileri sıralar." ,emoji: client.SearchEmojis(EmojiData.Moderator)},
      {label: "Seste Olan", value:"voice", description: "Seste olan tüm yekilileri sıralar." ,emoji: client.SearchEmojis(EmojiData.Moderator)},
      {label: "Seste Olmayan", value:"unvoice", description: "Aktif Olup Seste olmayan tüm yekilileri sıralar." ,emoji: client.SearchEmojis(EmojiData.Moderator)},
      {label: "Aktif", value:"online", description: "Aktif tüm yekilileri sıralar." ,emoji: client.SearchEmojis(EmojiData.Moderator)},
      {label: "Çevrimdışı", value:"offline", description: "Çevrimdışı tüm yekilileri sıralar." ,emoji: client.SearchEmojis(EmojiData.Moderator)},
      {label: "Mesaj Gönder", value:"message", description: "Seçimize göre mesaj gönderir." ,emoji: client.SearchEmojis(EmojiData.Announcement)},
    ])
    .setMinValues(1)
    .setMaxValues(6);
    let row = new MessageActionRow().addComponents(Menü);
    let Msg = await message.channel.send({ embeds: [Emb.setColor("WHITE").setThumbnail(message.guild.iconURL({ dynamic: true })).setDescription(`Merhaba ${message.author}, yetkili kontrol paneline hoşgeldiniz. ${Users.size} yetkilinize enüden seçtiğiniz şartlara göre listelenicek ve size bildirilecektir.
    
    > ▫️ Sunucu içindeki tüm yetkililerinizi listeleyebilirsiniz
    > ▫️ Sunucu içindeki seste bulunan yetkililerinizi listeleyebilirsiniz
    > ▫️ Sunucu içindeki seste bulunmayan yetkililerinizi listeleyebilirsiniz
    > ▫️ Sunucu içindeki aktif yetkililerinizi listeleyebilirsiniz
    > ▫️ Sunucu içindeki çevrimdışı yetkililerinizi listeleyebilirsiniz
    > ▫️ Belirtmiş olduğunuz yetkili kategorisine dilediğiniz şekilde mesaj gönderebilirsiniz.`)], components: [row] })

    const collector = await Msg.createMessageComponentCollector({
      componentType: 'SELECT_MENU',
      filter: (component) => component.user.id === message.author.id,
      time: 1000*60
    });
    let Array = [];
    collector.on('collect', async(i) => {
      if(i.values.find(x => x === "all")) Array.push({ ID: "all", Message: "", Mentions: true, Title: "Sunucu İçinde Bulunan Tüm Yetkililer:", Users: Users.map(x => x),Maps: [...Users].map((x, index) => `**${index+1}-)** ${x[1].presence ? Presence[x[1].presence.status]: client.SearchEmojis(EmojiData.Offline)} ${x[1]} - (\`${x[0]}\`) `)});
      if(i.values.find(x => x === "voice")) Array.push({ ID: "voice", Message: "", Mentions: false,Title: "Seste Bulunan Tüm Yetkililer:", Users: Users.filter(x => x.voice.channel).map(x => x),Maps: Users.filter(x => x.voice.channel).map((x, index) => `${x.voice.mute ? client.SearchEmojis(EmojiData.Off_Voice) : client.SearchEmojis(EmojiData.On_Voice)} ${x.voice.deaf ? client.SearchEmojis(EmojiData.Off_Headphone) : client.SearchEmojis(EmojiData.On_Headphone)} ${x.voice.streaming ? client.SearchEmojis(EmojiData.On_Streaming) : client.SearchEmojis(EmojiData.Off_Streaming)} ${x.voice.selfVideo ? client.SearchEmojis(EmojiData.On_Camera) : client.SearchEmojis(EmojiData.Off_Camera)} <#${x.voice.channelId}> ${x}`)});
      if(i.values.find(x => x === "unvoice")) Array.push({ ID: "unvoice", Message: "", Mentions: true,Title: "Seste Bulunmayan Aktif Tüm Yetkililer:", Users: Users.filter(x => !x.voice.channel && x.presence && x.presence.status !== "offline").map(x => x),Maps: Users.filter(x => !x.voice.channel && x.presence && x.presence.status !== "offline").map((x, index) => `${Presence[x.presence.status]} ${x} (\`${x.id}\`)`)});
      if(i.values.find(x => x === "online")) Array.push({ ID: "online", Message: "", Mentions: false,Title: "Aktif Tüm Yetkililer:", Users: Users.filter(x => x.presence && x.presence.status !== "offline").map(x => x),Maps: Users.filter(x => x.presence && x.presence.status !== "offline").map((x, index) => `${Presence[x.presence.status]} ${x} - \`${x.id}\``)});
      if(i.values.find(x => x === "offline")) Array.push({ ID: "offline", Message: "", Mentions: false,Title: "Çevrimdışı Tüm Yetkililer:", Users: Users.filter(x => x.presence === null ||  x.presence &&  ["online", "idle", "dnd"].every(y => x.presence.status === y)).map(x => x),Maps: Users.filter(x => x.presence === null ||  x.presence &&  ["online", "idle", "dnd"].every(y => x.presence.status === y)).map((x, index) => `${x} (\`${x.id}\`)`)});
      if(i.values.find(x => x === "message")) {
        await i.deferUpdate();
        let all = new MessageButton({ style: "SECONDARY", label: "Tüm Yetkililer", customId: `all`, disabled: Array.find(x => x.ID === "all") ? false : true });
        let voice = new MessageButton({ style: "SECONDARY", label: "Seste Olan", customId: `voice`, disabled: Array.find(x => x.ID === "voice") ? false : true });
        let unvoice = new MessageButton({ style: "SECONDARY", label: "Seste Olmayan", customId: `unvoice`, disabled: Array.find(x => x.ID === "unvoice") ? false : true });
        let online = new MessageButton({ style: "SECONDARY", label: "Aktif", customId: `online`, disabled: Array.find(x => x.ID === "online") ? false : true });
        let offline = new MessageButton({ style: "SECONDARY", label: "Çevrimdışı", customId: `offline`, disabled: Array.find(x => x.ID === "offline") ? false : true });
        let sesmsg = new MessageButton({ style: "PRIMARY", label: "Ses Daveti", customId: `ses`, disabled: Array.find(x => x.ID === "unvoice") ? false : true });
        let run = new MessageButton({ style: "PRIMARY", label: "Devam Et", customId: `run` });
        let row = new MessageActionRow().addComponents(all, voice, unvoice, online, offline);
        let row2 = new MessageActionRow().addComponents(run, sesmsg);
        Msg = await Msg.edit({ embeds: [Emb.setDescription(`Mesaj göndermek istediğiniz kategoriyi seçtikten sonra çıkan pencerede göndermek istediğiniz mesajı yazınız. Ses davetini seste olmayan yetkililere gönderebilirsiniz.`)], components: [row, row2] })
    
        const collector = await Msg.createMessageComponentCollector({
          componentType: 'BUTTON',
          filter: (component) => component.user.id === message.author.id,
          time: 1000*60*5
        });
        collector.on('collect', async(i) => {
          if(i.customId === "run") {
            await Msg.delete();
            for(let e = 0; e < Array.length; e += 1) {
              Array[e].Users.forEach(async(member) => {
                await member.send({ content: `${Array[e].Message}` }).catch(() => {
                  message.channel.send({ content: `${member} kullanıcısına mesaj gönderemiyorum.` })
                });
              })
            }
          } else if(i.customId === "ses") {
            await Msg.delete();
            let data = await Array.find(x => x.ID === "unvoice");
            data.Users.forEach(async(member) => {
                await member.send({ content: `Selam sana **${message.guild.name}** sunucusundan yazıyorum. Şuan aktifsin ve sunucuda seste değilsin senden rica etsem sesli sohbetlere girermisin. Müsait değilsen <#${message.guild.afkChannelId}> kanalında veya alone odalarında AFK bırakabilirsin.` }).catch(() => {
                });
              })
          } else {
            const modal = new Modal()
            .setCustomId(`${i.customId}`)
            .setTitle('Mesaj Gönder')
            .addComponents(
              new TextInputComponent() 
              .setCustomId('input')
              .setLabel('Mesaj Gönder')
              .setStyle('LONG')
              .setPlaceholder('Göndermek istediğiniz Mesajı Giriniz')
              .setRequired(true), 
            );
            showModal(modal, {
              client: client,
              interaction: i,
            });
            client.on('modalSubmit', async (modal) => {
              if (modal.customId === i.customId) {
                const nameResponse = modal.getTextInputValue('input');
                let data = await Array.find(x => x.ID === i.customId);
                data.Message = nameResponse;
                modal.reply({ content: "Mesaj Ayarlandı!\n\n" + nameResponse, ephemeral: true });
              }
            });
          }
        });
      } else {
        await Msg.delete();
        for(let e = 0; e < Array.length; e += 1) {
          await message.channel.send({ content: `\`\`\`fix\n${Array[e].Title}(${Array[e].Maps.length})\`\`\`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ` })
          let MsgCount = Math.floor(Array[e].Maps.length/15) + 1
          if(Array[e].Mentions === false) {
            for(let i = 0; i < MsgCount; i += 1) {
              if(!Array[e].Maps.length) {
                await message.channel.send({ content: " ` - ` Üye Bulunamadı." });
              } else {
                const toSend = Array[e].Maps.slice((i + 1) * 15 - 15, (i + 1) * 15);
                let Embed = new MessageEmbed({
                  description: `${toSend.join("\n")}`,
                  color: "0x36393E"
                })
                await message.channel.send({ embeds: [Embed] })
              }
            };
          } else {
            for(let i = 0; i < MsgCount; i += 1) {
              if(!Array[e].Maps.length) {
                await message.channel.send({ content: " ` - ` Üye Bulunamadı." });
              } else {
                const toSend = Array[e].Maps.slice((i + 1) * 15 - 15, (i + 1) * 15);
                await message.channel.send({ content: `${toSend.join("\n")}` })
              };
            };
          };
        };
      };
 //     let Log = client.SearchChannel(LogData.YtSay)
    });
  },
};