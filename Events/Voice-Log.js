const { MessageEmbed, Interaction } = require('discord.js')
const UserLog = require('../Database/UserLog.js');
const Client = global.client;
module.exports = async (oldState, newState) => {
    if(!global.log) return
    let Member = newState.guild.members.cache.get(newState.id) || oldState.guild.members.cache.get(oldState.id)
    let Log = Client.SearchChannels(global.Log.VoiceJL);
    let Log2 = Client.SearchChannels(global.Log.VoiceUp);
    if(Member.user.bot) return;
    if (!oldState.channelId && newState.channelId) {
        let list = Member.guild.members.cache.filter(member => member.voice.channel === Member.voice.channel)
        if(Log) Log.send({ embeds: [new MessageEmbed({
            color: "DARK_GREEN",
            author: {
                name: Member.displayName,
                icon_url: Member.user.avatarURL({ dynamic: true })
            },
            thumbnail: { 
                url: Member.guild.iconURL({ dynamic: true })
            },
            description: `${Member} kullanıcısı sesli sohbetlere **giriş yaptı**!

\`Kullanıcı :\` ${Member} - (\`${Member.id}\`)
\`Kanal     :\` [\`🔊${Member.voice.channel.name}\`](https://discord.com/channels/${Member.guild.id}/${Member.voice.channel.id}) - (\`${Member.voice.channelId}\`)
\`Tarih     :\` __<t:${Math.floor(Date.now() / 1000)}:F>__(<t:${Math.floor(Date.now() / 1000)}:R>)
`,
            fields: [
                {
                    name: `Odadaki Kullanıcılar(${list.size}):`,
                    value: `${list.size !== 0 ? list.map(member => `${member.voice.mute ? Client.SearchEmojis(global.Emoji.Off_Voice) : Client.SearchEmojis(global.Emoji.On_Voice)} ${member.voice.deaf ? Client.SearchEmojis(global.Emoji.Off_Headphone) : Client.SearchEmojis(global.Emoji.On_Headphone)} ${member.voice.streaming ? Client.SearchEmojis(global.Emoji.On_Streaming) : Client.SearchEmojis(global.Emoji.Off_Streaming)} ${member.voice.selfVideo ? Client.SearchEmojis(global.Emoji.On_Camera) : Client.SearchEmojis(global.Emoji.Off_Camera)} ${member}`).join("\n") : "Odada Kullanıcı Bulunmamakta!"}  `,
                }
            ]
        })] }).then(async(msg) => {
            await UserLog.findOneAndUpdate({ _Id: Member.id }, { $push: { "Voice": { date: Date.now(), log: msg.url, process: "join", channel: `<#${Member.voice.channelId}>` } } }, { upsert: true, new: true, setDefaultsOnInsert: true });
        }).catch(() => {})
    }
    if (oldState.channelId && !newState.channelId) {
        let list = Member.guild.members.cache.filter(member => member.voice.channel === oldState.guild.channels.cache.get(oldState.channelId))
        if(Log) Log.send({ embeds: [new MessageEmbed({
            color: "DARK_RED",
            author: {
                name: Member.displayName,
                icon_url: Member.user.avatarURL({ dynamic: true })
            },
            thumbnail: { 
                url: Member.guild.iconURL({ dynamic: true })
            },
            description: `${Member} kullanıcısı sesli sohbetlerden **çıkış yaptı**!

\`Kullanıcı :\` ${Member} - (\`${Member.id}\`)
\`Kanal     :\` [\`🔊${Client.SearchChannels(oldState.channelId).name}\`](https://discord.com/channels/${Member.guild.id}/${oldState.channelId}) - (\`${oldState.channelId}\`)
\`Tarih     :\` __<t:${Math.floor(Date.now() / 1000)}:F>__(<t:${Math.floor(Date.now() / 1000)}:R>)
`,
            fields: [
                {
                    name: `Odadaki Kullanıcılar(${list.size}):`,
                    value: `${list.size !== 0 ? list.map(member => `${member.voice.mute ? Client.SearchEmojis(global.Emoji.Off_Voice) : Client.SearchEmojis(global.Emoji.On_Voice)} ${member.voice.deaf ? Client.SearchEmojis(global.Emoji.Off_Headphone) : Client.SearchEmojis(global.Emoji.On_Headphone)} ${member.voice.streaming ? Client.SearchEmojis(global.Emoji.On_Streaming) : Client.SearchEmojis(global.Emoji.Off_Streaming)} ${member.voice.selfVideo ? Client.SearchEmojis(global.Emoji.On_Camera) : Client.SearchEmojis(global.Emoji.Off_Camera)} ${member}`).join("\n") : "Odada Kullanıcı Bulunmamakta!"}  `,
                }
            ]
        })] }).then(async(msg) => {
            await UserLog.findOneAndUpdate({ _Id: Member.id }, { $push: { "Voice": { date: Date.now(), log: msg.url, process: "leave", channel: `<#${oldState.channelId}>` } } }, { upsert: true, new: true, setDefaultsOnInsert: true });
        }).catch(() => {})
    }
    if (oldState.channelId && newState.channelId && oldState.channelId != newState.channelId){
        let listafter = Member.guild.members.cache.filter(member => member.voice.channel === oldState.guild.channels.cache.get(oldState.channelId))
        let listbefore = Member.guild.members.cache.filter(member => member.voice.channel === newState.guild.channels.cache.get(newState.channelId))
        if(Log) Log.send({ embeds: [new MessageEmbed({
            color: "DARK_WHITE",
            author: {
                name: Member.displayName,
                icon_url: Member.user.avatarURL({ dynamic: true })
            },
            thumbnail: { 
                url: Member.guild.iconURL({ dynamic: true })
            },
            description: `${Member} kullanıcısı sesli sohbetlerde **kanal değiştirdi**!

\`Kullanıcı :\` ${Member} - (\`${Member.id}\`)
\`Kanal     :\` [\`🔊${Client.SearchChannels(oldState.channelId).name}\`](https://discord.com/channels/${Member.guild.id}/${oldState.channelId}) \`==>\` [\`🔊${Client.SearchChannels(newState.channelId).name}\`](https://discord.com/channels/${Member.guild.id}/${newState.channelId}) 
\`Tarih     :\` __<t:${Math.floor(Date.now() / 1000)}:F>__(<t:${Math.floor(Date.now() / 1000)}:R>)
`,
            fields: [
                {
                    name: `Çıktığı Odadaki Kullanıcılar(${listafter.size}):`,
                    value: `${listafter.size !== 0 ? listafter.map(member => `${member.voice.mute ? Client.SearchEmojis(global.Emoji.Off_Voice) : Client.SearchEmojis(global.Emoji.On_Voice)} ${member.voice.deaf ? Client.SearchEmojis(global.Emoji.Off_Headphone) : Client.SearchEmojis(global.Emoji.On_Headphone)} ${member.voice.streaming ? Client.SearchEmojis(global.Emoji.On_Streaming) : Client.SearchEmojis(global.Emoji.Off_Streaming)} ${member.voice.selfVideo ? Client.SearchEmojis(global.Emoji.On_Camera) : Client.SearchEmojis(global.Emoji.Off_Camera)} ${member}`).join("\n") : "Odada Kullanıcı Bulunmamakta!"}  `,
                    inline: true
                },
                {
                    name: `Girdiği Odadaki Kullanıcılar(${listbefore.size}):`,
                    value: `${listbefore.size !== 0 ? listbefore.map(member => `${member.voice.mute ? Client.SearchEmojis(global.Emoji.Off_Voice) : Client.SearchEmojis(global.Emoji.On_Voice)} ${member.voice.deaf ? Client.SearchEmojis(global.Emoji.Off_Headphone) : Client.SearchEmojis(global.Emoji.On_Headphone)} ${member.voice.streaming ? Client.SearchEmojis(global.Emoji.On_Streaming) : Client.SearchEmojis(global.Emoji.Off_Streaming)} ${member.voice.selfVideo ? Client.SearchEmojis(global.Emoji.On_Camera) : Client.SearchEmojis(global.Emoji.Off_Camera)} ${member}`).join("\n") : "Odada Kullanıcı Bulunmamakta!"}  `,
                    inline: true
                }
            ]
        })] }).then(async(msg) => {
            await UserLog.findOneAndUpdate({ _Id: Member.id }, { $push: { "Voice": { date: Date.now(), log: msg.url, process: "change", channel: `<#${oldState.channelId}> \`==>\` <#${newState.channelId}>` } } }, { upsert: true, new: true, setDefaultsOnInsert: true });
        }).catch(() => {})
    }
    if (oldState.selfMute && !newState.selfMute) {
        if(!oldState.channelId && newState.channelId) return;
        if(Log2) Log2.send({ embeds: [new MessageEmbed({
            color: "DARK_NAVY",
            author: {
                name: Member.displayName,
                icon_url: Member.user.avatarURL({ dynamic: true })
            },
            thumbnail: { 
                url: Member.guild.iconURL({ dynamic: true })
            },
            description: `${Member} kullanıcısı sesli sohbetlerde kendi **susturmasını __kaldırdı__**!

\`Kullanıcı :\` ${Member} - (\`${Member.id}\`)
\`Kanal     :\` [\`🔊${Member.voice.channel.name}\`](https://discord.com/channels/${Member.guild.id}/${Member.voice.channel.id}) - (\`${Member.voice.channelId}\`);
\`Tarih     :\` __<t:${Math.floor(Date.now() / 1000)}:F>__(<t:${Math.floor(Date.now() / 1000)}:R>)
`
        })] }).then(async(msg) => {
            await UserLog.findOneAndUpdate({ _Id: Member.id }, { $push: { "Voice": { date: Date.now(), log: msg.url, process: "muteopen", channel: `<#${Member.voice.channelId}>` } } }, { upsert: true, new: true, setDefaultsOnInsert: true });
        }).catch(() => {})
    }
    if (!oldState.selfMute && newState.selfMute) {
        if(Log2) Log2.send({ embeds: [new MessageEmbed({
            color: "NAVY",
            author: {
                name: Member.displayName,
                icon_url: Member.user.avatarURL({ dynamic: true })
            },
            thumbnail: { 
                url: Member.guild.iconURL({ dynamic: true })
            },
            description: `${Member} kullanıcısı sesli sohbetlerde kendini **__susturdu__**!

\`Kullanıcı :\` ${Member} - (\`${Member.id}\`)
\`Kanal     :\` [\`🔊${Member.voice.channel.name}\`](https://discord.com/channels/${Member.guild.id}/${Member.voice.channel.id}) - (\`${Member.voice.channelId}\`);
\`Tarih     :\` __<t:${Math.floor(Date.now() / 1000)}:F>__(<t:${Math.floor(Date.now() / 1000)}:R>)
`
        })] }).then(async(msg) => {
            await UserLog.findOneAndUpdate({ _Id: Member.id }, { $push: { "Voice": { date: Date.now(), log: msg.url, process: "muteclose", channel: `<#${Member.voice.channelId}>` } } }, { upsert: true, new: true, setDefaultsOnInsert: true });
        })
    }
    if (oldState.selfDeaf && !newState.selfDeaf) {
        if(!oldState.channelId && newState.channelId) return;
        if(Log2) Log2.send({ embeds: [new MessageEmbed({
            color: "DARK_ORANGE",
            author: {
                name: Member.displayName,
                icon_url: Member.user.avatarURL({ dynamic: true })
            },
            thumbnail: { 
                url: Member.guild.iconURL({ dynamic: true })
            },
            description: `${Member} kullanıcısı sesli sohbetlerde kendi **sağırlaştırmasını __kaldırdı__**!

\`Kullanıcı :\` ${Member} - (\`${Member.id}\`)
\`Kanal     :\` [\`🔊${Member.voice.channel.name}\`](https://discord.com/channels/${Member.guild.id}/${Member.voice.channel.id}) - (\`${Member.voice.channelId}\`);
\`Tarih     :\` __<t:${Math.floor(Date.now() / 1000)}:F>__(<t:${Math.floor(Date.now() / 1000)}:R>)
`
        })] }).then(async(msg) => {
            await UserLog.findOneAndUpdate({ _Id: Member.id }, { $push: { "Voice": { date: Date.now(), log: msg.url, process: "deafopen", channel: `<#${Member.voice.channelId}>` } } }, { upsert: true, new: true, setDefaultsOnInsert: true });
        }).catch(() => {})
    }
    if (!oldState.selfDeaf && newState.selfDeaf) {
        if(!oldState.channelId && newState.channelId) return;
        if(Log2) Log2.send({ embeds: [new MessageEmbed({
            color: "ORANGE",
            author: {
                name: Member.displayName,
                icon_url: Member.user.avatarURL({ dynamic: true })
            },
            thumbnail: { 
                url: Member.guild.iconURL({ dynamic: true })
            },
            description: `${Member} kullanıcısı sesli sohbetlerde kendini **__sağırlaştırdı__**!

\`Kullanıcı :\` ${Member} - (\`${Member.id}\`)
\`Kanal     :\` [\`🔊${Member.voice.channel.name}\`](https://discord.com/channels/${Member.guild.id}/${Member.voice.channel.id}) - (\`${Member.voice.channelId}\`);
\`Tarih     :\` __<t:${Math.floor(Date.now() / 1000)}:F>__(<t:${Math.floor(Date.now() / 1000)}:R>)
`
        })] }).then(async(msg) => {
            await UserLog.findOneAndUpdate({ _Id: Member.id }, { $push: { "Voice": { date: Date.now(), log: msg.url, process: "deafclose", channel: `<#${Member.voice.channelId}>` } } }, { upsert: true, new: true, setDefaultsOnInsert: true });
        }).catch(() => {})
    }
    if (newState.streaming) {
        if(!oldState.channelId && newState.channelId) return;
        if(Log2) Log2.send({ embeds: [new MessageEmbed({
            color: "PURPLE",
            author: {
                name: Member.displayName,
                icon_url: Member.user.avatarURL({ dynamic: true })
            },
            thumbnail: { 
                url: Member.guild.iconURL({ dynamic: true })
            },
            description: `${Member} kullanıcısı sesli sohbetlerde **ekran __paylaşımı__** açtı!

\`Kullanıcı :\` ${Member} - (\`${Member.id}\`)
\`Kanal     :\` [\`🔊${Member.voice.channel.name}\`](https://discord.com/channels/${Member.guild.id}/${Member.voice.channel.id}) - (\`${Member.voice.channelId}\`);
\`Tarih     :\` __<t:${Math.floor(Date.now() / 1000)}:F>__(<t:${Math.floor(Date.now() / 1000)}:R>)
`
        })] }).then(async(msg) => {
            await UserLog.findOneAndUpdate({ _Id: Member.id }, { $push: { "Voice": { date: Date.now(), log: msg.url, process: "streamon", channel: `<#${Member.voice.channelId}>` } } }, { upsert: true, new: true, setDefaultsOnInsert: true });
        })
    }
    if (oldState.streaming && !newState.streaming) {
        if(!oldState.channelId && newState.channelId) return;
        if(Log2) Log2.send({ embeds: [new MessageEmbed({
            color: "DARK_PURPLE",
            author: {
                name: Member.displayName,
                icon_url: Member.user.avatarURL({ dynamic: true })
            },
            thumbnail: { 
                url: Member.guild.iconURL({ dynamic: true })
            },
            description: `${Member} kullanıcısı sesli sohbetlerde **ekran __paylaşımı__** kapattı!

\`Kullanıcı :\` ${Member} - (\`${Member.id}\`)
\`Kanal     :\` [\`🔊${Member.voice.channel.name}\`](https://discord.com/channels/${Member.guild.id}/${Member.voice.channel.id}) - (\`${Member.voice.channelId}\`);
\`Tarih     :\` __<t:${Math.floor(Date.now() / 1000)}:F>__(<t:${Math.floor(Date.now() / 1000)}:R>)
`
        })] }).then(async(msg) => {
            await UserLog.findOneAndUpdate({ _Id: Member.id }, { $push: { "Voice": { date: Date.now(), log: msg.url, process: "streamoff", channel: `<#${Member.voice.channelId}>` } } }, { upsert: true, new: true, setDefaultsOnInsert: true });
        }).catch(() => {})
    };
      if (newState.selfVideo) {
        if(!oldState.channelId && newState.channelId) return;
        if(Log2) Log2.send({ embeds: [new MessageEmbed({
            color: "YELLOW",
            author: {
                name: Member.displayName,
                icon_url: Member.user.avatarURL({ dynamic: true })
            },
            thumbnail: { 
                url: Member.guild.iconURL({ dynamic: true })
            },
            description: `${Member} kullanıcısı sesli sohbetlerde **kamera** açtı!

\`Kullanıcı :\` ${Member} - (\`${Member.id}\`)
\`Kanal     :\` [\`🔊${Member.voice.channel.name}\`](https://discord.com/channels/${Member.guild.id}/${Member.voice.channel.id}) - (\`${Member.voice.channelId}\`);
\`Tarih     :\` __<t:${Math.floor(Date.now() / 1000)}:F>__(<t:${Math.floor(Date.now() / 1000)}:R>)
`
        })] }).then(async(msg) => {
            await UserLog.findOneAndUpdate({ _Id: Member.id }, { $push: { "Voice": { date: Date.now(), log: msg.url, process: "cameraon", channel: `<#${Member.voice.channelId}>` } } }, { upsert: true, new: true, setDefaultsOnInsert: true });
        })
    }
    if (oldState.selfVideo && !newState.selfVideo) {
        if(!oldState.channelId && newState.channelId) return;
        if(Log2) Log2.send({ embeds: [new MessageEmbed({
            color: "DARK_YELLOW",
            author: {
                name: Member.displayName,
                icon_url: Member.user.avatarURL({ dynamic: true })
            },
            thumbnail: { 
                url: Member.guild.iconURL({ dynamic: true })
            },
            description: `${Member} kullanıcısı sesli sohbetlerde **kamera** kapattı!

\`Kullanıcı :\` ${Member} - (\`${Member.id}\`)
\`Kanal     :\` [\`🔊${Member.voice.channel.name}\`](https://discord.com/channels/${Member.guild.id}/${Member.voice.channel.id}) - (\`${Member.voice.channelId}\`);
\`Tarih     :\` __<t:${Math.floor(Date.now() / 1000)}:F>__(<t:${Math.floor(Date.now() / 1000)}:R>)
`
        })] }).then(async(msg) => {
            await UserLog.findOneAndUpdate({ _Id: Member.id }, { $push: { "Voice": { date: Date.now(), log: msg.url, process: "cameraoff", channel: `<#${Member.voice.channelId}>` } } }, { upsert: true, new: true, setDefaultsOnInsert: true });
        }).catch(() => {})
    }
}