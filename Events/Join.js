const { MessageEmbed, Guild } = require('discord.js')
const Invites = require('../Database/Invite');
const UserLog = require('../Database/UserLog.js');
const GuildLog = require('..//Database/GuildLog');
const cfg = require("../Config.json")
const Client = global.client
module.exports = async Member => {
  if(Member.user.bot) return;
  let GuildData = await GuildLog.findOneAndUpdate({ _Id: Member.guild.id }, { $set: { _Id: Member.guild.id }},{ upsert: true, new: true, setDefaultsOnInsert: true });
  if(GuildData.BannedUsers.find(x => x === Member.id)) return Member.ban({ reason: "ForcaBan" }).catch(() => {})
  let Roles = [];
  if(global.Config.Guild.UnregName === true) await Member.setNickname(global.Config.Guild.UnregNames).catch(() => {});
  let Suspensed;
  let Data = (await Member.guild.invites.fetch()).find(inv => inv.uses > Invites[Member.guild.id].get(inv.code));
  let Inviter = Data ? Member.guild.members.cache.get(Data.inviter.id) : Member.guild.vanityURLCode || "Bulunamadı";
  let Invited = await UserLog.findOneAndUpdate({ _Id: Inviter.id ? Inviter.id : Inviter }, { $set: { _Id: Inviter.id ? Inviter.id : Inviter }},{ upsert: true, new: true, setDefaultsOnInsert: true });
  if(Member.guild.vanityURLCode) { var URL = await Member.guild.fetchVanityData() };
  await UserLog.updateOne({ _Id: Member.id }, { $set: { "Invitees": Inviter }});
  let veri = Invited.Invited;
  veri.Total.push({ _User: Member, Date: Date.now() }); veri.Leave = veri.Leave.filter(x => x._User !== Member.id);
  if((Date.now() - Member.user.createdTimestamp) < 1000*60*60*24*7) {
    veri.Fake.push({ _User: Member, Date: Date.now() })
    Roles.push(...global.Config.Roles.Suspensed.NewAcc); Suspensed = true;
  } else {
    veri.Regular.push({ _User: Member, Date: Date.now() })
    Roles.push(...global.Config.Roles.General.Unregister); Suspensed = false;
    if(Member.nameCheck() === true) Roles.push(...global.Config.Roles.General.Family); 
  };
    await UserLog.updateOne({ _Id: Inviter.id ? Inviter.id : Inviter }, { $set: { "Invited": veri }});
  await Member.setRoles(Roles);
  
  let Welcome = await Client.SearchChannels(global.Config.Channels.Welcome), JoinLeave = await Client.SearchChannels(global.Log.JoinLeave), Invite = await Client.SearchChannels(global.Config.Channels.Invite), Tag = await Client.SearchChannels(global.Log.Tag);

  if(Welcome) Welcome.send({ content: `Sunucumuza hoşgeldin ${Member}! Seninle birlikte **${Member.guild.memberCount}** kişi olduk.
Hesabın **<t:${Math.floor((Member.user.createdTimestamp) / 1000)}:f>** tarihinde yani **<t:${Math.floor((Member.user.createdTimestamp) / 1000)}:R>** oluşturulmuş. Oldukça Güvenli! ${Client.SearchEmojis(global.Emoji.Onay)}
                                                  
Tagımızı (**${cfg.Tags.tagsay} - #${cfg.Tags.Number}**) alarak ailemizden birisi olursun ve bize destek olmuş olursunuz!
Sunucumuza kayıt olduğunda kurallar kanalına göz atmayı unutmayınız. Kayıt olduktan sonra kuralları okuduğunuzu kabul edeceğiz.

${Inviter.user ? `**${Inviter.user.username.replace("`", "")}** tarafından sunucuya davet edildin. Bu harika! 🎉🎉🎉` : Inviter === "Bulunamadı" ? "Hmm Seni davet edeni bulamadım. Gökyüzünden İnmiş olabilirmisin " : "Özel bağlantımızı kullanarak sunucuya iniş yaptın sana tekrar minnettarız...🎉🎉🎉"} ` });
  
  if(JoinLeave) JoinLeave.send({ embeds: [new MessageEmbed({
    color: "DARK_GREEN",
    author: {
      name: Member.user.username,
      icon_url: Member.user.avatarURL({ dynamic: true })
    },
    description: `${Member} kullanıcısı sunucuya __giriş__ yaptı.`,
    fields: [
      { name: 'Hesap Kurulma Tarihi:', value: `__<t:${Math.floor((Member.user.createdTimestamp) / 1000)}:f>__ ${Suspensed === true ? Client.SearchEmojis(global.Emoji.suspicious) : Client.SearchEmojis(global.Emoji.Innocent)}`, inline: true },
      { name: 'Davet Eden:', value: `${Inviter.user ? `[\`@${Inviter.user.username}\`](https://discord.com/users/${Inviter.id}), \`${Inviter.user.id}\`` : Inviter === "Bulunamadı" ? "Bulunamadı." : `${Inviter}`}`, inline: true },
      { name: 'Hesap Bilgileri:', value: `[\`@${Member.user.username}\`](https://discord.com/users/${Member.id}), \`${Member.user.id}\` `, inline: true },
      { name: 'İşlemler:', value: `\` ${Suspensed === true ? "Cazalıya atıldı!" : Member.nameCheck() === true ? "Taglı ve Kayıtsız Rolleri Verildi." : "Kayıtsız Rolleri Verildi." } \`` },
    ],
    timestamp: Date.now(),
    thumbnail: { 
      url: Member.user.avatarURL({ dynamic: true })
    }    
  })] });
  
  if(Invite) Invite.send({ content: `${Client.SearchEmojis(global.Emoji.Join)} ${Inviter.user ? `${Member} sunucumuza katıldı. ${Inviter.user.tag} tarafından <t:${Math.floor(Date.now() / 1000)}:R> davet edildi.(**${Invited.Invited.Total.length}** davet)` 
                          :
                          Inviter === "Bulunamadı" ? `${Member} sunucumuza <t:${Math.floor(Date.now() / 1000)}:R> katıldı ama kim tarafından davet edildiğini bulamadım`
                          : 
                          `${Member} sunucumuza özel bağlantı ile <t:${Math.floor(Date.now() / 1000)}:R> katıldı. Toplam URL kullanımı: ${URL.uses}`}` });

}
