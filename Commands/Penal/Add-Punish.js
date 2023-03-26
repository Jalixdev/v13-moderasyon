const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require('discord.js');
const UserLog = require('../../Database/UserLog');
const GuildLog = require('../../Database/GuildLog');
var PunishList = [
  {
    Name: "Chatte Abartı Küfür/Hakaret",
    Time: 1000*60*5,
    Limited: 5,
    Type: "Text"
  },
  {
    Name: "Chatte Dini/Milli/Ailevi Küfür",
    Time: 1000*60*5,
    Limited: 3,
    Type: "Text"
  },
  {
    Name: "Chatte Tilt Edici Davranış ve Kışkırtma",
    Time: 1000*60*10,
    Limited: 2,
    Type: "Text"
  },
  {
    Name: "Flood/Spam/Abartı Capslock/Abartı Emoji",
    Time: 1000*60*5,
    Limited: 10,
    Type: "Text"
  },
  {
    Name: "Metin Kanallarını Amacı Dışında Kullanmak",
    Time: 1000*60*30,
    Limited: 2,
    Type: "Text"
  },
  {
    Name: "İfşa Paylaşımı/İstenilmeyen İçerik",
    Time: 1000*60*60,
    Limited: 2,
    Type: "Text"
  },
  {
    Name: "Seste Abartı Küfür/Hakaret",
    Time: 1000*60*5,
    Limited: 5,
    Type: "Voice"
  },
  {
    Name: "Seste Dini/Milli/Ailevi Küfür",
    Time: 1000*60*20,
    Limited: 3,
    Type: "Voice"
  },
  {
    Name: "Seste Bass/Music",
    Time: 1000*60*10,
    Limited: 3,
    Type: "Voice"
  },
]
module.exports = {
  name: "ceza",
  description: "Kullanıcı ceza verme komutu.",
  category: "Authorized",
  aliases: ["punish", "addpunish"], 
  run: async (client, message, args, EmojiData, LogData, Config, RolData) => {
    let Emb = new MessageEmbed({
      color: "BLACK",
      author: {
        name: "Cezalandıma",
        icon_url: message.author.avatarURL({ dynamic: true })
      },
    });
    if(message.member.Permissions(Config.Roles.Authorized.Punish) === false) return;
    let Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!Member) return message.channel.send({ embeds: [Emb.setDescription("Cezalandırma işlemi için bir kullanıcı veya ID belirtmek zorundasın.")] }).Delete(3);
    if((Member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerId ) || Member.id === message.guild.ownerId  || !Member.manageable || Member.id === message.author.id ) return message.channel.send({ embeds: [Emb.setDescription(`${Member.id === message.guild.ownerId ? "İşlem için belirttiğiniz kullanıcı sunucu sahibi bence fazla zorlama 😬" : message.author.id === Member.id ? "Ne yazık ki kendine işlem uygulayamazsın." : !Member.manageable ? "Belirttiğin kullanıcıya işlem yapmaya ne yazık ki yetkim yetmiyor." : Member.roles.highest.position > message.member.roles.highest.position ? "Belirttiğiniz kullanıcı sizden üst yetkide." : "Belirttiğin kullanıcı ile aynı yetkide bulunuyorsun."}`)] }).Delete(4);
    let Notes = args.slice(1).join(" ");
    let Control = await GuildLog.findOneAndUpdate({ _Id: message.guild.id }, { $set: { _Id: message.guild.id }},{ upsert: true, new: true, setDefaultsOnInsert: true });    
    var tmute, vmute, jail
    Control.ActivityPunish.filter(x => x._User === Member.id).forEach(async x => {
      if(x.Type === "TMute") {
        tmute = true
        PunishList = PunishList.filter(x => x.Type !== "Text")
      };
      if(x.Type === "VMute") {
        vmute = true
        PunishList = PunishList.filter(x => x.Type !== "Voice")
      };
      if(x.Type === "Jail") {jail = true };
    });
    if(jail === true || (tmute === true && vmute === true)) return message.channel.send({ embeds: [Emb.setDescription(jail === true ? "Kullanıcının geçerli \"*Jail*\" cezası sona erene kadar herhangi bir ceza-i işlem uygulanamaz." : "Kullanıcının geçerli yazılı ve sesli cezaları zaten bulunuyor.")] }).Delete(3);
    let PunishMenüs = [];
    for(let e = 0; e < PunishList.length; e += 1) {
      await PunishMenüs.push({label: "Ceza Açıklaması:",value: PunishList[e].Name, description: PunishList[e].Name ,emoji: client.SearchEmojis(EmojiData.Punish)});
    };
    let Menü = new MessageSelectMenu()
    .setCustomId("punish")
    .setPlaceholder("Ceza Seçiniz!")
    .addOptions(PunishMenüs)
    let row = new MessageActionRow().addComponents(Menü);
    let Msg = await message.channel.send(
      {  
        content: `${client.SearchEmojis(EmojiData.Rector)} ${Member} kullanıcısına ne sebepten ceza vermek istediğinizi aşağıdaki menüden lütfen seçiniz!${vmute === true ? "\n`Kullanıcının geçerli bir ses cezası olduğu için ses cezalar filtrelendi!`" : ""}${tmute === true ? "\n`Kullanıcının geçerli bir yazılı cezası olduğu için yazılı cezalar filtrelendi!`" : ""} `,
        components: [row]
      }
    );
    const collector = await Msg.createMessageComponentCollector({
      componentType: 'SELECT_MENU',
      filter: (component) => component.user.id === message.author.id,
      time: 1000*60
    });
        
    collector.on('collect', async(i) => {
      await i.deferUpdate()
      let Data = await UserLog.findOneAndUpdate({ _Id: Member.id }, { $set: { _Id: Member.id }},{ upsert: true, new: true, setDefaultsOnInsert: true });
      let ceza = PunishList.find(x => x.Name === i.values[0]);
      let count = Data.Punish.filter(x => x.Reason === ceza.Name).map(x => x).length
      let process, process2, time;
      if(ceza.Type === "Text") {
        count > ceza.Limited ? process = "Jail": process = "TMute";
        count > ceza.Limited ? process2 = "Jail": process2 = "Mute";
      } else if(ceza.Type === "Voice") {
        count > ceza.Limited ? process = "Jail": process = "VMute";
        count > ceza.Limited ? process2 = "Jail": process2 = "Mute";
      }
      count > ceza.Limited ? time = ceza.Time*(count - ceza.Limited): time = ceza.Time*(count+1);
      await Msg.edit({ content: `${client.SearchEmojis(EmojiData.Rector)} ${process2 === "Mute" ? `${Member} kullanıcısı "*${ceza.Name}*" sebebiyle \`${client.Time(time)}\` ${process2 === "Vmute" ? "__sesli kanallarda__": "__yazılı kanallarda__"} **susturuldu**!` : `${Member} kullanıcısı "*${ceza.Name}*" sebebiyle aldığı ceza sayısı **${ceza.Limited}** sınırını aştığı için \`${client.Time(time)}\` cezalıya atıldı!`} `, components: []}).Delete(3);
      client.AddPunish(process, message.guild, Member, message.member, time, ceza.Name, Notes, process2 === "Jail" ? Member._roles : []);
      await message.react(client.SearchEmojis(EmojiData.Onay)).catch(() => {});
    });
       
    /*collector.on('end', async(i) => {
      await Msg.delete().catch(() => {});
      await message.react(client.SearchEmojis(EmojiData.Ret)).catch(() => {});
    });*/
  }
};