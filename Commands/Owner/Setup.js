const { MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu, Collector } = require("discord.js");

const GuildLog = require('../../Database/GuildLog');

const Emoji = require('../../Database/GuildEmojiManager');
const Log = require('../../Database/GuildLogManager');
const Rol = require('../../Database/GuildRolManager');

var EmojiPacket = [
  {
    url: "https://cdn.discordapp.com/emojis/1064896832129474621.gif?size=96&quality=lossless",
    name: "yes",
    Database: "Onay"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1054115842696159433.gif?size=96&quality=lossless",
    name: "no",
    Database: "Ret"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1063098208504524890.webp?size=96&quality=lossless",
    name: "punish",
    Database: "Punish"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1063098212002570330.webp?size=96&quality=lossless",
    name: "rector",
    Database: "Rector"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1063098214988922990.webp?size=96&quality=lossless",
    name: "timezone",
    Database: "Timezone"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1063098217954295848.gif?size=96&quality=lossless",
    name: "pinkexc",
    Database: "PinkExc"
  },
  {
    url: "https://cdn.discordapp.com/emojis/998068263160389643.webp?size=96&quality=lossless",
    name: "off_voice",
    Database: "Off_Voice"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1017186845936865300.webp?size=96&quality=lossless",
    name: "off_headphone",
    Database: "Off_Headphone"
  },
  {
    url: "https://cdn.discordapp.com/emojis/969200884821151824.webp?size=96&quality=lossless",
    name: "off_text",
    Database: "Off_Text"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1007708290815361106.webp?size=96&quality=lossless",
    name: "on_voice",
    Database: "On_Voice"
  },
  {
    url: "https://cdn.discordapp.com/emojis/993972955505766542.webp?size=96&quality=lossless",
    name: "on_headphone",
    Database: "On_Headphone"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1013883118022819992.webp?size=96&quality=lossless",
    name: "on_text",
    Database: "On_Text"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1017186846763143188.webp?size=96&quality=lossless",
    name: "black_point",
    Database: "Black_Point"
  },
  {
    url: "https://cdn.discordapp.com/emojis/993972940670500964.webp?size=96&quality=lossless",
    name: "jail",
    Database: "Jail"
  },
  {
    url: "https://cdn.discordapp.com/emojis/969200901468336138.gif?size=44&quality=lossless",
    name: "ban",
    Database: "Ban"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1065734730449965116.webp?size=96&quality=lossless",
    name: "join",
    Database: "Join"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1065734733188841633.webp?size=96&quality=lossless",
    name: "leave",
    Database: "Leave"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1065734735961268356.gif?size=96&quality=lossless",
    name: "right",
    Database: "Right"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1065734738523988008.webp?size=96&quality=lossless",
    name: "left",
    Database: "Left"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1065734741527122022.webp?size=96&quality=lossless",
    name: "home_page",
    Database: "Home"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1063098743542534174.gif?size=96&quality=lossless",
    name: "hallo",
    Database: "Merhaba"
  },
  {
    url: "https://cdn.discordapp.com/emojis/821197240646238228.gif?size=96&quality=lossless",
    name: "innocent",
    Database: "Innocent"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1062764497984569395.gif?size=96&quality=lossless",
    name: "suspicious",
    Database: "Suspicious"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1062764535158669313.gif?size=96&quality=lossless",
    name: "confetti",
    Database: "Welcome"
  },
  {
    url: "https://cdn.discordapp.com/emojis/753954993958289448.gif?size=96&quality=lossless",
    name: "kurabiye",
    Database: "Anime"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1013883136951726210.webp?size=96&quality=lossless",
    name: "moderator",
    Database: "Moderator"
  },
  {
    url: "https://cdn.discordapp.com/emojis/960670099365326918.webp?size=96&quality=lossless",
    name: "online",
    Database: "Online"
  },
  {
    url: "https://cdn.discordapp.com/emojis/942135029235056680.webp?size=96&quality=lossless",
    name: "offline",
    Database: "Offline"
  },
  {
    url: "https://cdn.discordapp.com/emojis/946548932685746246.webp?size=96&quality=lossless",
    name: "dnd",
    Database: "Dnd"
  },
  {
    url: "https://cdn.discordapp.com/emojis/924816606129967124.webp?size=96&quality=lossless",
    name: "idle",
    Database: "İdle"
  },
  {
    url: "https://cdn.discordapp.com/emojis/848035599759179807.webp?size=96&quality=lossless",
    name: "announcement",
    Database: "Announcement"
  },
  {
    url: "https://cdn.discordapp.com/emojis/979047263622017074.gif?size=96&quality=lossless",
    name: "welcome",
    Database: "Welcome"
  },
  {
    url: "https://cdn.discordapp.com/emojis/770040353880408084.webp?size=96&quality=lossless",
    name: "afk",
    Database: "Afk"
  },
  {
    url: "https://cdn.discordapp.com/emojis/909868218259238974.webp?size=44&quality=lossless",
    name: "reply",
    Database: "Reply"
  },
  {
    url: "https://cdn.discordapp.com/emojis/891311585602175046.webp?size=96&quality=lossless",
    name: "error",
    Database: "Error"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1029996503202275368.webp?size=96&quality=lossless",
    name: "request",
    Database: "Request"
  },
  {
    url: "https://cdn.discordapp.com/emojis/854409906542346260.webp?size=96&quality=lossless",
    name: "application",
    Database: "Application"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1026225193812766810.webp?size=96&quality=lossless",
    name: "aqua_point",
    Database: "Aqua_Point"
  },
  {
    url: "https://cdn.discordapp.com/emojis/730516511814582432.gif?size=96&quality=lossless",
    name: "blue_heart",
    Database: "Blue_Heart"
  },
  {
    url: "https://cdn.discordapp.com/emojis/1026114242077794416.webp?size=96&quality=lossless",
    name: "task_one",
    Database: "Task_One",
  },
  {
    url: "https://cdn.discordapp.com/emojis/1026114175891689572.webp?size=96&quality=lossless",
    name: "task_two",
    Database: "Task_Two",
  },
  {
    url: "https://cdn.discordapp.com/emojis/1026114376534605974.webp?size=96&quality=lossless",
    name: "task_theree",
    Database: "Task_Theree",
  },
  {
    url: "https://cdn.discordapp.com/emojis/1026114339830251610.webp?size=96&quality=lossless",
    name: "task_four",
    Database: "Task_Four",
  },
  {
    url: "https://cdn.discordapp.com/emojis/1026114099479859250.webp?size=96&quality=lossless",
    name: "task_five",
    Database: "Task_Five",
  },
  {
    url: "https://cdn.discordapp.com/emojis/1028368629575733309.webp?size=96&quality=lossless",
    name: "matter",
    Database: "Matter",
  },
  {
    url: "https://cdn.discordapp.com/emojis/1038575143494103070.gif?size=96&quality=lossless",
    name: "loading",
    Database: "Loading",
  },
  {
    url: "https://cdn.discordapp.com/emojis/1025255222240620565.gif?size=96&quality=lossless",
    name: "star",
    Database: "Star",
  },
  {
    url: "https://cdn.discordapp.com/emojis/1029996484139159633.webp?size=96&quality=lossless",
    name: "disconect",
    Database: "Disconnect"
  }
];
//
var LogPacket = [
  {
    name: "text-mute-log",
    Database: "TMute"
  },
  {
    name: "voice-mute-log",
    Database: "VMute"
  },
  {
    name: "jail-log",
    Database: "Jail"
  },
  {
    name: "register-log",
    Database: "Register"
  },
  {
    name: "join-leave-log",
    Database: "JoinLeave"
  },
  {
    name: "yetkili-say-log",
    Database: "YtSay"
  },
  {
    name: "voice-join-leave-log",
    Database: "VoiceJL"
  },
  {
    name: "voice-update-log",
    Database: "VoiceUp"
  },
  {
    name: "tag-log",
    Database: "Tag"
  },
  {
    name: "rol-log",
    Database: "Rol"
  },
  {
    name: "private-room-log",
    Database: "PrivateRoomSystem"
  }
]
module.exports = {
  name: "setup",
  aliases: ['kurulum', "s"], 
  run: async (client, message, args, EmojiData, LogData, Config, RolData) => {
    let GuildData = await GuildLog.findOneAndUpdate({ _Id: message.guild.id }, { $set: { _Id: message.guild.id }},{ upsert: true, new: true, setDefaultsOnInsert: true });
    if(!Config.Bot.Owner.some(ownerID => message.author.id === ownerID)) return;
    let Menü = new MessageSelectMenu()
    .setCustomId("check")
    .setPlaceholder("Kurulum Seçiniz!")
    .addOptions([
      {label: "Guard Sistemi", description: "Koruma Sistemleri, Limitleri, Ayarları", value:"guard"},
      {label: "Kurulum", description: "Emoji, Rol, Kanal ve Sistem Kurulumları", value:"Req"},
    ]);
    let row = new MessageActionRow().addComponents(Menü);

    let msg = await message.channel.send({ embeds: [new MessageEmbed({
      color: "BLACK",
      description: `**${message.guild.name}** Kurulum Menüsüne Hoşgeldiniz Aşşağıdan Kolayca Kurulumları yapabilirsiniz.`,
      fields: [
        {
          name: `Kurulum`,
          value: `\`\`\`md
# Kurulumlar
  ↳ Emoji Kurulumu
  ↳ Log Kurulumu\`\`\``,
          inline: false
        },
        {
          name: `Guard`,
          value: `\`\`\`md
# GUARD (BAKIMDA)
  ↳ Role Guard
  ↳ Channel Guard
  ↳ URL Guard
  ↳ Chat Guard\`\`\``,
          inline: false
        },
      ],
    })], components: [row] })

    let collector = await msg.createMessageComponentCollector({
      componentType: 'SELECT_MENU',
      filter: (component) => component.user.id === message.author.id,
      time: 1000*60*60*30
    });

    collector.on('collect', async int => {
      if (int.values[0] === 'guard') {
        msg = await int.reply("Guard Sistemi Şuan Bakımda!")
    }})


    collector.on('collect', async int => {
      if (int.values[0] === 'Req') {
        let emj = new MessageButton({ style: "SECONDARY", label: "Emoji", customId: "emj" }),
            log = new MessageButton({ style: "SECONDARY", label: "Log", customId: "log" }),

            row = new MessageActionRow().addComponents(emj, log),
            msg = await int.reply({ components: [row], ephemeral:true, fetchReply: true }),
            collector = await msg.createMessageComponentCollector({
              componentType: 'BUTTON',
              filter: (component) => component.user.id === message.author.id,
              time: 1000*60*60*30
            });

            
            collector.on('collect', async(i) => {
              if(i.customId === "emj") {
                await i.deferUpdate()
                for(var i = 0;EmojiPacket.length > i ;i++){
                  if(!message.guild.emojis.cache.find(x => x.name == EmojiPacket[i].name)) {
                    let emj = await message.guild.emojis.create(EmojiPacket[i].url, EmojiPacket[i].name);
                    message.channel.send({content: `${emj.name} - (\`${emj.id}\`) İsimli Emoji Başarıyla Kuruldu. (${emj})`});
                    PushData(EmojiPacket[i].Database, emj.id, message.guild.id, "emoji")
                  }
                }
                await message.reply({ content: "\\✅ Emoji Kurulum İşlemi Tamamlandı!"})
              };
              if(i.customId === "log") {
                await i.deferUpdate()
                await message.guild.channels.create("Logest", {type:"GUILD_CATEGORY"}).then( async(logParent) => {
                  for(var i = 0;LogPacket.length > i ;i++){
                    let chnl = await message.guild.channels.create(LogPacket[i].name, { type: "GUILD_TEXT", parent: logParent.id })
                    await chnl.permissionOverwrites.edit(message.guild.roles.cache.find(r => r.name === '@everyone').id,{
                      VIEW_CHANNEL: false
                    })
                    message.channel.send({content: `${chnl} - (\`${chnl.id}\`) İsimli Log Başarıyla Kuruldı.`});
                    await PushData(LogPacket[i].Database, chnl.id, message.guild.id, "log")
                  }
                })
                await message.reply({ content: "\\✅ Log Kurulum İşlemi Tamamlandı!"})
              }
              if(i.customId === "systems") {
                let Menü = new MessageSelectMenu()
                .setCustomId("system")
                .setPlaceholder("Sistem Seçiniz!")
                .addOptions([
                  {label: "Private Room System", description: "Kullanıcıların kendi özel kanallarını oluşturup yönetmesine yarar", value:"private"},
                ]);
                let row = new MessageActionRow().addComponents(Menü);
                msg = await i.reply({ components: [row], ephemeral:true, fetchReply: true })
                let collector = await msg.createMessageComponentCollector({
                  componentType: 'SELECT_MENU',
                  filter: (component) => component.user.id === message.author.id,
                  time: 1000*60*60*30
                });
                collector.on("collect", async(system) => {
                  if(system.values[0] === "private") {
                    if(GuildData.PrivarteSystem  === true) {
                      await GuildLog.updateOne({ _Id: message.guild.id }, { $set: { "PrivarteSystem": false }});
                      return system.reply({ content: "Sistem Kapatıldı! Tekrardan açtığınızda son ayarlardan açılmış olacaktır.", ephemeral: true });
                    } else {
                      await GuildLog.updateOne({ _Id: message.guild.id }, { $set: { "PrivarteSystem": true }});

                      let quiz = [
                        {
                          "question": "Kullanıcıların oda oluşturmak için girmesi gereken kanalı belirtiniz.",
                          "answers": [...message.guild.channels.cache.filter(x => x.type === "GUILD_VOICE").map(x=>x.id), ...message.guild.channels.cache.filter(x => x.type === "GUILD_VOICE").map(x=>x.name), ...message.guild.channels.cache.filter(x => x.type === "GUILD_VOICE").map(x=>x)]
                        },
                        {
                          "question": "Odaların oluşturulacağı kategoriyi belirtiniz.",
                          "answers": [...message.guild.channels.cache.filter(x => x.type === "GUILD_CATEGORY").map(x=>x.id), ...message.guild.channels.cache.filter(x => x.type === "GUILD_CATEGORY").map(x=>x.name), ...message.guild.channels.cache.filter(x => x.type === "GUILD_CATEGORY").map(x=>x.name)]
                        },
                        {
                          "question": "Kullanıcıların alt başlık oluşturacağı kanalı belirtiniz .",
                          "answers": [...message.guild.channels.cache.filter(x => x.type === "GUILD_TEXT").map(x=>x.id), ...message.guild.channels.cache.filter(x => x.type === "GUILD_TEXT").map(x=>x.name), ...message.guild.channels.cache.filter(x => x.type === "GUILD_TEXT").map(x=>x)]
                        },
                      ];

                      let itemCount = 0
                      let item = quiz[itemCount];
                      const filter = response => {
                        return item.answers.some(answer => answer === response.content.toLowerCase());
                      };
                      message.reply({ content: item.question, fetchReply: true })
                      .then(() => {
                        system.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                        .then(async collected => {
                          let channel = client.SearchChannels(collected.first().content);
                          if(!channel) return message.reply('Belirttiğiniz kanal bulunamadı lütfen tekrar deneyiniz.');
                          await PushData("PrivarteSystemVoiceChannel", channel.id, message.guild.id, "Guild");
                          itemCount++
                          item = quiz[itemCount];
                          message.reply({ content: item.question, fetchReply: true })
                          .then(() => {
                            system.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                            .then(async collected => {
                              let channel2 = client.SearchChannels(collected.first().content);
                              if(!channel2) return message.reply('Belirttiğiniz kategori bulunamadı lütfen tekrar deneyiniz.');
                              await PushData("PrivarteSystemCategory", channel2.id, message.guild.id, "Guild")
                              itemCount++;
                              item = quiz[itemCount];
                              message.reply({ content: item.question, fetchReply: true })
                              .then(() => {
                                system.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                                .then(async collected => {
                                  let channel3 = client.SearchChannels(collected.first().content);
                                  if(!channel3) return message.reply('Belirttiğiniz kanal bulunamadı lütfen tekrar deneyiniz.');
                                  await PushData("PrivarteSystemChatChannel", channel3.id, message.guild.id, "Guild")
                                  await message.reply({ content: "\\✅ Private Room Sistemi Başarıyla Kuruldu!"})
                                })
                              })    
                            })                        
                          });
                        })
                      })
                    }
                  }
                });
              }
            });
      }
      

            });    
        }
      }


      
async function PushData(data, inData, guildID, type) {
  if(type === "emoji") {
    await Emoji.findOneAndUpdate({_Id: guildID}, {$set: {[`${data}`]: inData}}, { upsert: true, new: true, setDefaultsOnInsert: true })
  }
  if(type === "rol") {
    await Rol.findOneAndUpdate({_Id: guildID}, {$set: {[`${data}`]: inData}}, { upsert: true, new: true, setDefaultsOnInsert: true })
  }
  if(type === "log") {
    await Log.findOneAndUpdate({_Id: guildID}, {$set: {[`${data}`]: inData}}, { upsert: true, new: true, setDefaultsOnInsert: true })
  }
  if(type === "Guild") {
    await GuildLog.findOneAndUpdate({_Id: guildID}, {$set: {[`${data}`]: inData}}, { upsert: true, new: true, setDefaultsOnInsert: true })
  }
}