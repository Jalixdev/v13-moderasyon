const { MessageEmbed } = require('discord.js')
const Invite = require('../Database/Invite');
const UserLog = require('../Database/UserLog.js');
const Client = global.client

module.exports = async Member => {
  if(Member.user.bot) return;
  let Suspensed;
  let Invitees = await UserLog.findOneAndUpdate({ _Id: Member.id }, { $set: { _Id: Member.id }},{ upsert: true, new: true, setDefaultsOnInsert: true });
  let InviterVeri = Member.guild.members.cache.get(Invitees.Invitees) || Member.guild.vanityURLCode || "Bulunamadı";
  if(Member.guild.vanityURLCode){ var URL = await Member.guild.fetchVanityData();}
  let Inviter = await UserLog.findOneAndUpdate({ _Id: InviterVeri.id ? InviterVeri.id : InviterVeri }, { $set: { _Id: InviterVeri.id ? InviterVeri.id : InviterVeri }},{ upsert: true, new: true, setDefaultsOnInsert: true });

  let veri = Inviter.Invited;
  veri.Regular = veri.Regular.filter(x => x._User !== Member.id);
  veri.Total = veri.Total.filter(x => x._User !== Member.id);
  veri.Fake = veri.Fake.filter(x => x._User !== Member.id);
  veri.Leave.push({ _User: Member.id, Date: Date.now() });
    await UserLog.findOneAndUpdate({ _Id: InviterVeri.id ? InviterVeri.id : Inviter }, { $set: { "Invited": veri }},{ upsert: true, new: true, setDefaultsOnInsert: true });

  if((Date.now() - Member.user.createdTimestamp) < 1000*60*60*24*7) { Suspensed = true } else { Suspensed = false };
  
  
  let JoinLeave = await Client.SearchChannels(global.Log.JoinLeave), Invite = Client.SearchChannels(global.Config.Channels.Invite);
  if(JoinLeave) JoinLeave.send({ embeds: [new MessageEmbed({
    color: "DARK_RED",
    author: {
      name: Member.user.username,
      icon_url: Member.user.avatarURL({ dynamic: true })
    },
    description: `${Member} kullanıcısı sunucudan __çıkış__ yaptı.`,
    fields: [
      { name: 'Hesap Kurulma Tarihi:', value: `__<t:${Math.floor((Member.user.createdTimestamp) / 1000)}:f>__ ${Suspensed === true ? Client.SearchEmojis(global.Emoji.suspicious) : Client.SearchEmojis(global.Emoji.Innocent)}`, inline: true },
      { name: 'Davet Eden:', value: `${Inviter.user ? `[\`@${Invitees.user.username}\`](https://discord.com/users/${InviterVeri.id}), \`${InviterVeri.user.id}\`` : Inviter === "Bulunamadı" ? "Bulunamadı." : `${InviterVeri}`}`, inline: true },
      { name: 'Hesap Bilgileri:', value: `[\`@${Member.user.username}\`](https://discord.com/users/${Member.id}), \`${Member.user.id}\` `, inline: true },
    ],
    timestamp: Date.now(),
    thumbnail: { 
      url: Member.user.avatarURL({ dynamic: true })
    }    
  })] });
  if(Invite) Invite.send({ content: `${Client.SearchEmojis(global.Emoji.Leave)} ${InviterVeri.user ? `${Member} sunucudan <t:${Math.floor(Date.now() / 1000)}:R> ayrıldı. ${InviterVeri.user.tag} tarafından davet edildi.(**${Inviter.Invited.Total.length}** davet)` 
                          :
                          Inviter._Id === "Bulunamadı" ? `${Member} sunucudan <t:${Math.floor(Date.now() / 1000)}:R> ayrıldı ama kim tarafından davet edildiğini bulamadım`
                          : 
                          `${Member} sunucumuzdan <t:${Math.floor(Date.now() / 1000)}:R> ayrıldı, URL ile katılmıştı. Toplam URL kullanımı: ${URL.uses}`} ` })
}
