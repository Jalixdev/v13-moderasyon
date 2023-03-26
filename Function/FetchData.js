const Config = require('../Config');

const UserLog = require('../Database/UserLog');
const GuildLog = require('../Database/GuildLog');

const Client = global.client

Client.PenaltyQuery = async function(Member, Guild) {
  let GuildData = await GuildLog.findOneAndUpdate({ _Id: Guild.id }, { $set: { _Id: Guild.id }},{ upsert: true, new: true, setDefaultsOnInsert: true });
  let Filter = GuildData.Punish.filter(x => x._User === Member.id);
  let List = Filter.reverse().map((x, index) => `\`#${x._Id}:\` \`${new Date(x.Date).formatDate()}\` [[${x.Type.replace("TMute", Client.SearchEmojis(global.Emoji.Off_Text)).replace("Jail", Client.SearchEmojis(global.Emoji.Jail)).replace("VMute", Client.SearchEmojis(global.Emoji.Off_Voice))}](${x.LogMsg})] [[\`@${Guild.members.cache.get(x._Admin).displayName}\`](https://discord.com/users/${Guild.members.cache.get(x._Admin).id})] ${GuildData.ActivityPunish.find(y => y._Id === x._Id) ? "`Aktif`" : "`Pasif`"} - <t:${Math.floor(x.Finish / 1000)}:R> `)
  return List;
};
Client.NamesQuery = async function(Member, Guild) {
  let GuildData = await GuildLog.findOneAndUpdate({ _Id: Guild.id }, { $set: { _Id: Guild.id }},{ upsert: true, new: true, setDefaultsOnInsert: true });
  let Filter = GuildData.Register.filter(x => x._User === Member.id);
  let List = Filter.reverse().map((x, index) => `\`${index + 1}:\` \`${new Date(x.Date).formatDate()}\` [\`${x.FullName}\`] [[\`@${Guild.members.cache.get(x._Admin).displayName}\`](https://discord.com/users/${Guild.members.cache.get(x._Admin).id})] - <t:${Math.floor(x.Date / 1000)}:R> `)
  return List;
};
Client.VoiceLogQuery = async function(Member, Guild) {
  let UserData = await UserLog.findOneAndUpdate({ _Id: Member.id }, { $set: { _Id: Member.id }},{ upsert: true, new: true, setDefaultsOnInsert: true });
  let Filter = UserData.Voice;
  let Obj = {join: "\\🟢", leave: "\\🔴", change: "\\🔵", muteclose: Client.SearchEmojis(global.Emoji.Off_Voice), muteopen: Client.SearchEmojis(global.Emoji.On_Voice), deafclose: Client.SearchEmojis(global.Emoji.Off_Headphone), deafopen: Client.SearchEmojis(global.Emoji.On_Headphone), streamon: "\\🟣", streamoff: "\\🟣"  }
  let List = Filter.reverse().map((x, index) => `\`${index + 1}:\` \`${new Date(x.date).formatDate()}\` [${Obj[x.process]}](${x.log}) ${x.channel}`)
  return List;
};
Client.BasicStatsAndPenaltyQuery = async function(Member, Guild, Days = 0) {
  let Datas = [];
  Days = Date.now() - (Number(Days) ? Days : 0 * (1000*60*60));
  let UserData = await UserLog.findOneAndUpdate({ _Id: Member.id }, { $set: { _Id: Member.id }},{ upsert: true, new: true, setDefaultsOnInsert: true });
  if(!UserData) return undefined;
  let FilterVoice = UserData.Voice_Stats,FilterMessage = UserData.Message_Stats,FilterAut = UserData.Aut_Stats, FilterInvite = UserData.Invited;
  Datas.push({
    TOTAL_VOICE_TIME: FilterVoice.Total.length ? FilterVoice.Total.filter(x => x.Date < Days).map(x => x.Point).reduce((a, b) => a + b, 0) : 0,
    TOTAL_MESSAGE_COUNT: FilterMessage.Total.length ? FilterMessage.Total.filter(x => x.Date < Days).map(x => x.Point).reduce((a, b) => a + b, 0) : 0,
    TOTAL_STREAMER_TIME: FilterVoice.Stream.length ? FilterVoice.Stream.filter(x => x.Date < Days).map(x => x.Point).reduce((a, b) => a + b, 0) : 0,
    TOTAL_AFK_TIME: FilterVoice.Afk.length ? FilterVoice.Afk.filter(x => x.Date < Days).map(x => x.Point).reduce((a, b) => a + b, 0) : 0,
    TOTAL_TAGEST_COUNT: FilterAut.Tagest.length ? FilterAut.Tagest.filter(x => x.Date < Days).length : 0,
    TOTAL_CONFIRMED_COUNT: {
      MAN: FilterAut.Confirmed.filter(x => x.Gender === "man").length ? FilterAut.Confirmed.filter(x => x.Date < Days).filter(x => x.Gender === "man").length : 0,
      WOMAN: FilterAut.Confirmed.filter(x => x.Gender === "woman").length ? FilterAut.Confirmed.filter(x => x.Date < Days).filter(x => x.Gender === "woman").length : 0
    },
    TOTAL_AUT_COUNT: FilterAut.Authorized.lengt ? FilterAut.Authorized.filter(x => x.Date < Days).length : 0,
    TOTAL_INVITE_COUNT: {
      TOTAL: FilterInvite.Total.length ? FilterInvite.Total.filter(x => x.Date < Days).length : 0,
      REGULAR: FilterInvite.Regular.length ? FilterInvite.Regular.filter(x => x.Date < Days).length : 0,
      LEAVE: FilterInvite.Leave.length ? FilterInvite.Leave.filter(x => x.Date < Days).length : 0,
      FAKE: FilterInvite.Fake.length ? FilterInvite.Fake.filter(x => x.Date < Days).length : 0,
    }
  });
  
  let Voices = new Set(FilterVoice.Total.map(x => x.Channel));
  let Texts = new Set(FilterMessage.Total.map(x => x.Channel));
  let Parents = new Set();
  let TextChannelOrder = [], VoiceChannelOrder = [], ParentOrderChannel = [], ParentOrder = [];

  [...Voices].forEach(x => {
    let veri = FilterVoice.Total.filter(y => y.Channel === x).map(x => x.Point).reduce((a, b) => a + b, 0)
    VoiceChannelOrder.push({ channel: x, puan: veri });
    let channel = Guild.channels.cache.get(x)
    if(channel) {
      ParentOrderChannel.push({ parent: channel.parentId ? channel.parentId : "Diğer", puan: veri })
      Parents.add(channel.parentId ? channel.parentId : "Diğer")
    } else {
      ParentOrderChannel.push({ parent: "Diğer", puan: veri })
    };
  });
  [...Texts].forEach(x => {
    let veri = FilterMessage.Total.filter(y => y.Channel === x).map(x => x.Point).reduce((a, b) => a + b, 0)
    TextChannelOrder.push({ channel: x, puan: veri })
  });

  [...Parents].forEach(x => {
    let veri =  ParentOrderChannel.filter(y => y.parent === x).map(puan => puan.puan).reduce((a, b) => a + b, 0)
    ParentOrder.push({parent: x, puan: veri })
  })

  let OrderVoice = VoiceChannelOrder.sort((a, b) => b.puan - a.puan).slice(0, 10)//.map((data, index) => `${message.guild.emojis.cache.get(Emoji.Aqua)} <#${data.channel}>: \`${client.TimeConverter(data.puan)}\``).join("\n");
  let OrderText = TextChannelOrder.sort((a, b) => b.puan - a.puan).slice(0, 10)//.map((data, index) => `${clien(Emoji.Aqua)} <#${data.channel}>: \`${data.puan} mesaj\``).join("\n");
  let OrderParent = ParentOrder.sort((a, b) => b.puan - a.puan).slice(0, 10)//.map((data, index) => `${message.guild.emojis.cache.get(Emoji.Aqua)} <#${data.parent}>: \`${client.TimeConverter(data.puan)}\``).join("\n");

  Datas.push({
    VOİCE_CHANNEL_LİST: OrderVoice,
    MESSAGE_CHANNEL_LİST: OrderText,
    PARENT_LİST: OrderParent
  });
  return Datas;
}
Client.BasicStatsTop = async function(Message, Guild, Desk = 20,  Days = 0) {
  let Members = await UserLog.find();
  let Datas = {
    VOICE_TOP: [],
    MESSAGE_TOP: [],
    STREAMER_TOP: [],
    INVITE_TOP: [],
    REGISTER_TOP: [],
  }
  for(let member of Members){
    let UserData = await UserLog.findOne({ _Id: member._Id });
    if(UserData) {
      if(!Guild.members.cache.get(member._Id)) return;
      let [ 
        { 
          TOTAL_VOICE_TIME: Voice,
          TOTAL_MESSAGE_COUNT: Message,
          TOTAL_STREAMER_TIME: Stream,
          TOTAL_AFK_TIME: Afk,
          TOTAL_TAGEST_COUNT: Tagest,
          TOTAL_CONFIRMED_COUNT: { 
            MAN: Man,
            WOMAN: Woman
          },
          TOTAL_AUT_COUNT: Aut,
          TOTAL_INVITE_COUNT: {
            TOTAL: Total,
            REGULAR: Regular,
            LEAVE: Leave,
            FAKE: Fake,
          }
        }
      ] = await Client.BasicStatsAndPenaltyQuery(Guild.members.cache.get(member._Id), Guild, Days);
      Datas.VOICE_TOP.push({ User: member._Id, Point: Voice });
      Datas.MESSAGE_TOP.push({ User: member._Id, Point: Message });
      Datas.STREAMER_TOP.push({ User: member._Id, Point: Stream });
      Datas.INVITE_TOP.push({
        User: member._Id, Point: {
          TOTAL: Total,
          REGULAR: Regular,
          LEAVE: Leave,
          FAKE: Fake,
        }
      });
      Datas.REGISTER_TOP.push({
        User: member._Id, Point: {
          TOTAL: Man + Woman,
          MAN: Man,
          WOMAN: Woman
        }
      });
    };
  };
  return Datas;
};