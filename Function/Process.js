const { MessageEmbed } = require('discord.js');

const cfg = require('../Config');

const UserLog = require('../Database/UserLog');
const GuildLog = require('../Database/GuildLog');

let Client = global.client

Client.AddPunish = async function (Type, Guild, Member, Admin, Time, Reason, Notes, Roles) {
  
  let GuildData = await GuildLog.findOneAndUpdate({ _Id: Guild.id }, { $set: { _Id: Guild.id }},{ upsert: true, new: true, setDefaultsOnInsert: true });
  
  let Emj = { TMute: Client.SearchEmojis(global.Emoji.Off_Text), VMute: Client.SearchEmojis(global.Emoji.Off_Voice), Jail: Client.SearchEmojis(global.Emoji.Jail), Ban: Client.SearchEmojis(global.Emoji.Ban) };
  let PunishCount = GuildData.Punish.length <= 0 ? 1 : Math.max(GuildData.Punish.map(x => x._Id).length)+1
  let Embed = new MessageEmbed({
    color: "BLACK",
    author: {
      name: "Cezalandıma",
      icon_url: Guild.iconURL({ dynamic: true })
    },
    description: `${Emj[Type]} ${Member} kullanıcısı ${Admin} tarafından cezalandırıldı!(\`#${PunishCount}\`)
> ${Client.SearchEmojis(global.Emoji.Black_Point)} Ceza Türü: \` ${Type.replace("TMute", "Yazılı Kanallardan Uzaklaştırma.").replace("Vmute", "Sesli Kanalllardan Uzaklaştırma").replace("Jail", "Sunucudan Uzaklaştırma").replace("Ban", "Sunucudan Yasaklama")} \`
> ${Client.SearchEmojis(global.Emoji.Black_Point)} Cezalandıran: [\`@${Admin.displayName}\`](https://discord.com/users/${Admin.id}) - (\`${Admin.id}\`) 
> ${Client.SearchEmojis(global.Emoji.Black_Point)} Cezalandırılan: [\`@${Member.displayName ? Member.displayName : Member.username}\`](https://discord.com/users/${Member.id}) - (\`${Member.id}\`) 
> ${Client.SearchEmojis(global.Emoji.Black_Point)} Cezalandırma Sebebi: [**${Reason}**]

${Client.SearchEmojis(global.Emoji.Timezone)}  ${Time === "Süresiz" ? `\`Süresiz\`` : `\`${Client.Time(Time).replace("dkk. ", "dakika")}:\` [<t:${Math.floor(Date.now() / 1000)}:f> **==>** <t:${Math.floor((Date.now()+Time) / 1000)}:f>]`}`,
    footer: {
      text: `${Notes ? `Yetkili Notu: ${Notes}`: ""}`
    },
    thumbnail: {
      url: Member.user.avatarURL() ? Member.user.avatarURL({ dynamic: true }) : Guild.iconURL({ dynamic: true }),
    },
  });
    
  let Msg;
  if(Type === "TMute") {
    await Member.roles.add(global.Config.Roles.Suspensed.TextMuted).catch(() => {});
    let Log = await Client.SearchChannels(global.Log.TMute);
    if(!Log) return Msg = undefined;
    Msg = await Log.send({ embeds: [Embed] }).catch(() => {});
  } else 
  if(Type === "VMute") {
    await Member.roles.add(global.Config.Roles.Suspensed.VoiceMuted).catch(() => {});
    if(Member.voice.channel) Member.voice.setMute(true, Reason);
    let Log = await Client.SearchChannels(global.Log.VMute);
    if(!Log) return Msg = undefined;
    Msg = await Log.send({ embeds: [Embed] }).catch(() => {});
  } else 
  if(Type === "Jail") {
    await Member.setRoles(global.Config.Roles.Suspensed.Jail);
    let Log = await Client.SearchChannels(global.Log.Jail);
    if(!Log) return Msg = undefined;
    Msg = await Log.send({ embeds: [Embed] }).catch(() => {});
  } else
  if(Type === "Ban") {
    await Member.ban({ reason: Reason });
    let Log = await Client.SearchChannels(global.Log.Jail);
    if(!Log) return Msg = undefined;
    Msg = await Log.send({ embeds: [Embed] }).catch(() => {});
  } else
  if(Type === "ForceBan") {
    await Member.ban({ reason: Reason }).catch(() => {});
    await GuildLog.findOneAndUpdate({ _Id: Guild.id }, { $push: { "BannedUsers": Member.id } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    let Log = await Client.SearchChannels(global.Log.Jail);
    if(!Log) return Msg = undefined;
    Msg = await Log.send({ embeds: [Embed] }).catch(() => {});
  };
  await Member.send({ embeds: [Embed.setThumbnail(Guild.iconURL({ dynamic: true })).setDescription(`Merhaba ${Member}, ${Guild.name} sunucusunda *"${Reason}"* sebebiyle ceza aldın. Lütfen sunucu kurallarına uy. Haksız bir ceza işlemi yapıldığını düşünüyorsan bu olayı üst yönetime bildirmekten çekinme.\n\n**${Guild.name} Yönetim Ekibi!**`)] }).catch(() => {});
  await UserLog.findOneAndUpdate({ _Id: Member.id }, { $push: { "Punish": { Reason }}},{ upsert: true, new: true, setDefaultsOnInsert: true });
  await GuildLog.findOneAndUpdate({ _Id: Guild.id }, { $push: { "Punish": { _Id: PunishCount, _User: Member.id, _Admin: Admin.id, Type: Type, Reason: Reason, Notes: Notes, LogMsg: Msg.url, Time: Time, Point: 0, Date: Date.now(), Finish: Date.now()+Time, FinishType: "Auto" }}},{ upsert: true, new: true, setDefaultsOnInsert: true });
  await GuildLog.findOneAndUpdate({ _Id: Guild.id }, { $push: { "ActivityPunish": { _Id: PunishCount, _User: Member.id, _Admin: Admin.id, Type: Type, Reason: Reason, Notes: Notes, LogMsg: Msg.url, Time: Time, Point: 0, Date: Date.now(), Finish: Date.now()+Time }}},{ upsert: true, new: true, setDefaultsOnInsert: true });
};

Client.RemovePunish = async function (Number, Guild, Member, Admin) {
  
  let UserData = await UserLog.findOneAndUpdate({ _Id: Member.id }, { $set: { _Id: Member.id }},{ upsert: true, new: true, setDefaultsOnInsert: true });
  let GuildData = await GuildLog.findOneAndUpdate({ _Id: Guild.id }, { $set: { _Id: Guild.id }},{ upsert: true, new: true, setDefaultsOnInsert: true });
  let Emj = { TMute: Client.SearchEmojis(global.Emoji.On_Text), VMute: Client.SearchEmojis(global.Emoji.On_Voice), Jail: Client.SearchEmojis(global.Emoji.Jail) };

  let Activity = GuildData.ActivityPunish, General = GuildData.Punish, User = UserData.Punish
  let data = await Activity.find(x => x._Id == Number);
  Activity = await Activity.filter(x => x._Id != Number);
  General = await General.filter(x => x._Id != Number);
  let Arr = User.filter(x => x.Reason == data.Reason).map(x => x).pop();
  let newArr = User.filter(x => x.Reason != data.Reason).concat(Arr);
  let Embed = new MessageEmbed({
    color: "BLACK",
    author: {
      name: "Ceza Kaldırma",
      icon_url: Guild.iconURL({ dynamic: true })
    },
    description: `${Emj[data.Type]} ${Member} kullanıcısının [\`#${Number}\`](${data.LogMsg}) ID numaralı cezası ${Admin} tarafından kaldırıldı!
> ${Client.SearchEmojis(global.Emoji.Black_Point)} İşlem: \` ${data.Type.replace("TMute", "Yazılı Kanallardan Uzaklaştırma.").replace("Vmute", "Sesli Kanalllardan Uzaklaştırma").replace("Jail", "Sunucudan Uzaklaştırma")} \`
> ${Client.SearchEmojis(global.Emoji.Black_Point)} Cezalandırma Sebebi: [**${data.Reason}**]
> ${Client.SearchEmojis(global.Emoji.Black_Point)} Ceza Kaldırma Tarihi: <t:${Math.floor(Date.now() / 1000)}:f>`,
    footer: {
      text: `${data.Notes ? `Yetkili Notu: ${data.Notes}`: ""}`
    },
    thumbnail: {
      url: Member.user.avatarURL() ? Member.user.avatarURL({ dynamic: true }) : Guild.iconURL({ dynamic: true }),
    },
  });
  
  if(data.Type === "Jail") {
    Member.setRoles(global.Config.Roles.General.Unregister);
    let Log = await Client.SearchChannels(global.Log.Jail);
    await Log.send({ embeds: [Embed] }).catch(() => {});
  };
  if(data.Type === "TMute") {
    Member.roles.remove(global.Config.Roles.Suspensed.TextMuted)
    let Log = await Client.SearchChannels(global.Log.TMute);
    await Log.send({ embeds: [Embed] }).catch(() => {});
};
  if(data.Type === "VMute") {
    Member.roles.remove(global.Config.Roles.Suspensed.VoiceMuted).catch(() => {});
    if(Member.voice.channel) Member.voice.setMute(false, data.Reason); 
    let Log = await Client.SearchChannels(global.Log.VMute);
    await Log.send({ embeds: [Embed] }).catch(() => {});
 }
  await UserLog.updateOne({ _Id: Member.id }, { $set: { ActivityPunish: newArr } });  
  await GuildLog.updateOne({ _Id: global.Config.Guild.Id }, { $set: { Punish: Activity } });  
  await GuildLog.updateOne({ _Id: global.Config.Guild.Id }, { $set: { Punish: General } });  

}
Client.Register = async function(Name, Age, Member, Message, Gender) {
  let fullName, Guild = Message.guild, Admin = Message.member;
  Age ? fullName = `${Name} ${cfg.Tags.tagsay}` : Name ? fullName = `${Name} ${cfg.Tags.tagsay}` : fullName = `${Member.user.username} ${cfg.Tags.tagsay}`;
  if(fullName) Member.setNickname(fullName)
  await Message.react(Client.SearchEmojis(global.Emoji.Onay)).catch(() => {});
  let Embed = new MessageEmbed({
    color: "BLACK",
    author: {
      name: "Kayıt",
      icon_url: Guild.iconURL({ dynamic: true })
    },
    description: `${Member} kullanıcısı ${Admin} tarafından kayıt edildi!
> ${Client.SearchEmojis(global.Emoji.Black_Point)} İşlem: \` ${Gender.replace("woman", "Kadın Üye Kaydı").replace("man", "Erkek Üye Kaydı")} \`
> ${Client.SearchEmojis(global.Emoji.Black_Point)} Kayıt Eden: [\`@${Admin.displayName}\`](https://discord.com/users/${Admin.user.id}) - (\`${Admin.user.id}\`) 
> ${Client.SearchEmojis(global.Emoji.Black_Point)} Kayıt Edilen: [\`@${Member.displayName}\`](https://discord.com/users/${Member.id}) - (\`${Member.user.id}\`) 

${Gender === "man" ? Client.SearchEmojis(global.Emoji.Erkek) : Client.SearchEmojis(global.Emoji.Kız)} \`Değiştirilen İsim:\` \`${fullName}\`
`,
    thumbnail: {
      url: Member.user.avatarURL() ? Member.user.avatarURL({ dynamic: true }) : Guild.iconURL({ dynamic: true }),
    },
  });
  let Log = Client.SearchChannels(global.Log.Register);
  if(Log); let Msg = await Log.send({ embeds: [Embed] });
  
  Message.channel.send({ embeds: [new MessageEmbed({
    author: {
      name: "Kayıt",
      icon_url: Member.user.avatarURL({ dynamic: true })
    },
    color: Gender.replace("woman", "DARK_PURPLE").replace("man", "DARK_BLUE"),
    description: `[\`@${Member.user.tag}\`](https://discord.com/users/${Member.user.id}) isimli kullanıcı sunucuya \`${fullName}\` ismiyle kayıt edildi.(${Gender.replace("woman", global.Config.Roles.General.Woman.map(x => `<@&${x}>`)).replace("man", global.Config.Roles.General.Man.map(x => `<@&${x}>`))})`,
    footer: {
      text: "'.isimler @Jalix/ID' yaparak kullanıcının eski isimlerine bakabilirsiniz."
    }
  })] }).Delete(10);
  let Aut = await UserLog.findOneAndUpdate({ _Id: Admin.id }, { $set: { _Id: Admin.id }},{ upsert: true, new: true, setDefaultsOnInsert: true });
  let veri = Aut.Aut_Stats;
  veri.Confirmed.push({ _User: Member.id, Date: Date.now(), Gender: Gender });
  await UserLog.updateOne({ _Id: Admin.id  }, { $set: { "Aut_Stats": veri }});
  await GuildLog.findOneAndUpdate({ _Id: Guild.id }, { $push: { "Register": { _User: Member.id, _Admin: Admin.id, Gender: Gender, FullName: fullName, Name: Name, Age: Age, LogMsg: Msg.url, Date: Date.now() }}},{ upsert: true, new: true, setDefaultsOnInsert: true });
  await UserLog.findOneAndUpdate({ _Id: Member.id }, { $push: { "Names": { _User: Member.id, _Admin: Admin.id, Gender: Gender, FullName: fullName, Name: Name, Age: Age, LogMsg: Msg.url, Date: Date.now(), Process: "register-command" }}},{ upsert: true, new: true, setDefaultsOnInsert: true });
  await Member.setRoles(Gender === "man" ? global.Config.Roles.General.Man : global.Config.Roles.General.Woman);
  if(Member.nameCheck() === true) await Member.roles.add(global.Config.Roles.General.Tag).catch(() => {});
  let Chat = Client.SearchChannels(global.Config.Channels.Chat);
  if(Chat) Chat.send({ content: `${Client.SearchEmojis(global.Emoji.Merhaba)} ${Member} kullanıcısı aramıza katıldı. Ona sıcak bir "Merhaba!" demeye ne dersiniz?` });
};
Client.UnRegister = async function(Member, Admin, Guild, Reason) {
  await Member.setRoles(global.Config.Roles.General.Unregister);if(Member.voice.channelId) { await Member.voice.disconnect() };
  if(global.Config.Guild.UnregName === true) await Member.setNickname(global.Config.Guild.UnregNames).catch(() => {});
  let Embed = new MessageEmbed({
    color: "BLACK",
    author: {
      name: "Kayıtsız",
      icon_url: Guild.iconURL({ dynamic: true })
    },
    description: `${Member} kullanıcısı ${Admin} tarafından kayıtsıza atıldı!
> ${Client.SearchEmojis(global.Emoji.Black_Point)} İşlem: \` Kayıtlı Üyeyi Kayıtsıza Atma. \`
> ${Client.SearchEmojis(global.Emoji.Black_Point)} Kayıtsıza Atan: [\`@${Admin.displayName}\`](https://discord.com/users/${Admin.user.id}) - (\`${Admin.user.id}\`) 
> ${Client.SearchEmojis(global.Emoji.Black_Point)} Kayıtsıza Atılan: [\`@${Member.displayName}\`](https://discord.com/users/${Member.id}) - (\`${Member.user.id}\`) 
> ${Client.SearchEmojis(global.Emoji.Black_Point)} İşlem Tarihi: [\`@${Member.displayName}\`](https://discord.com/users/${Member.id}) - (\`${Member.user.id}\`) 

${Client.SearchEmojis(global.Emoji.Right_Arrow)} \`Kayıtsıza Atılma Nedeni:\` \` ${Reason} \``,
    thumbnail: {
      url: Member.user.avatarURL() ? Member.user.avatarURL({ dynamic: true }) : Guild.iconURL({ dynamic: true }),
    }
  });
  let Log = Client.SearchChannels(global.Log.Register);
  if(Log); let Msg = await Log.send({ embeds: [Embed] });
  await GuildLog.findOneAndUpdate({ _Id: Guild.id }, { $push: { "UnRegister": { _User: Member.id, _Admin: Admin.id, Reason: Reason, LogMsg: Msg.url, Date: Date.now() }}},{ upsert: true, new: true, setDefaultsOnInsert: true });
};
Client.Name = async function(Name, Age, Member, Message) {
  let fullName, Guild = Message.guild, Admin = Message.member;
  Age ? fullName = `${Name} ${cfg.Tags.tagsay}` : Name ? fullName = `${Name} ${cfg.Tags.tagsay}` : fullName`${Member.user.username} ${cfg.Tags.tagsay}`;
  if(fullName) Member.setNickname(fullName)
  await Message.react(Client.SearchEmojis(global.Emoji.Onay)).catch(() => {});
  let Embed = new MessageEmbed({
    color: "BLACK",
    author: {
      name: "İsim",
      icon_url: Guild.iconURL({ dynamic: true })
    },
    description: `${Member} kullanıcısı ${Admin} tarafından kayıt edildi!
> ${Client.SearchEmojis(global.Emoji.Black_Point)} İşlem: \` Sunucu İçiİsim Değiştirme \`
> ${Client.SearchEmojis(global.Emoji.Black_Point)} Kayıt Eden: [\`@${Admin.displayName}\`](https://discord.com/users/${Admin.user.id}) - (\`${Admin.user.id}\`) 
> ${Client.SearchEmojis(global.Emoji.Black_Point)} Kayıt Edilen: [\`@${Member.displayName}\`](https://discord.com/users/${Member.id}) - (\`${Member.user.id}\`) 

${Client.SearchEmojis(global.Emoji.Right_Arrow)} \`Değiştirilen İsim:\` \`${fullName}\`
`,
    thumbnail: {
      url: Member.user.avatarURL() ? Member.user.avatarURL({ dynamic: true }) : Guild.iconURL({ dynamic: true }),
    },
  });
  let Log = Client.SearchChannels(global.Log.Register);
  if(Log); let Msg = await Log.send({ embeds: [Embed] });
  Message.channel.send({ embeds: [new MessageEmbed({
    title: "Kayıt",
    author: {
      icon_url: Member.user.avatarURL({ dynamic: true })
    },
    color: "BLACK",
    description: `[\`@${Member.user.tag}\`](https://discord.com/users/${Member.user.id}) isimli kullanıcının sunucu içi ismi \`${fullName}\` olarak değiştirildi.)`,
    footer: {
      text: "'.isimler @Jalix/ID' yaparak kullanıcının eski isimlerine bakabilirsiniz."
    }
  })] }).Delete(10);
  await GuildLog.findOneAndUpdate({ _Id: Guild.id }, { $push: { "Register": { _User: Member.id, _Admin: Admin.id, Gender: "İsim Değiştirme", FullName: fullName, Name: Name, Age: Age, LogMsg: Msg.url, Date: Date.now() }}},{ upsert: true, new: true, setDefaultsOnInsert: true });
  await UserLog.findOneAndUpdate({ _Id: Member.id }, { $push: { "Names": { _User: Member.id, _Admin: Admin.id, Gender: "İsim Değiştirme", FullName: fullName, Name: Name, Age: Age, LogMsg: Msg.url, Date: Date.now(), Process: "name-command" }}},{ upsert: true, new: true, setDefaultsOnInsert: true });
}