const { MessageSelectMenu, MessageButton, MessageActionRow } = require('discord.js');
const UserLog = require('../Database/UserLog.js');
const Client = global.client;

module.exports = async(oldMember, newMember) => {
    if(!global.log)return
    let Log = Client.SearchChannels(global.Log.Rol);
    let Member = newMember.guild.members.cache.get(newMember.id);
    let fetchedLogs = await oldMember.guild.fetchAuditLogs({
        limit: 1,
    });
    let logs = fetchedLogs.entries.first(), { executor, target } = logs;
    if(executor.bot) return;
    let MemberPermissions = new MessageButton({ style: 'PRIMARY', label: "Kullanıcı İzinlerini Görüntüleyin!", customId: "permissions-"+target.id  });
    let row = new MessageActionRow().addComponents(MemberPermissions);
    newMember.roles.cache.forEach(async(role) => {
        if (!oldMember.roles.cache.has(role.id)) {
            if(Log) Log.send({ embeds: [new MessageEmbed({
                color: "DARK_GREEN",
                author: {
                    name: executor.tag,
                    icon_url: executor.avatarURL({ dynamic: true }),
                },
                thumbnail: {
                    url: oldMember.guild.iconURL({ dynamic: true }),
                },
                description: `${role} rolü ${target} kullanıcısına ${executor} tarafından __eklendi.__ `,
                fields: [
                    {
                        name: 'Rol Özellikleri:',
                        value: `\`\`\`• Rol İsmi: ${role.name}\n• Rol Rengi: ${role.hexColor}\n•Rol İzinleri: ${(await Client.RolesPermissionConverter(role.permissions.toArray())).join(", ")} \`\`\` `,
                    },
                    {
                        name: 'Eski Rolleri',
                        value: `${!oldMember._roles.length ? "@everyone" : oldMember._roles.map(x => `<@&${x}>`).join(", ")}`,
                    },
                    {
                        name: 'Yeni Rolleri',
                        value: `${newMember._roles.map(x => `<@&${x}>`.replace(`<@&${role.id}>`, `__**[Hedef Rol:${role}]**__`))}`,
                    }
                ],
                footer: {
                    text: target.tag,
                    icon_url: target.avatarURL({ dynamic: true })
                }
            })], components: [row] }).then(async Msg => {
                await UserLog.findOneAndUpdate({ _Id: target.id }, { $push: { "Roles": { Admin: executor.id, Date: Date.now(), Type: "manuel", Process: "add", Role: role.id, Log: Msg.url } } }, { upsert: true, new: true, setDefaultsOnInsert: true });
            });
        };
    }).catch(() => {});

    oldMember.roles.cache.forEach(async(role) => {
        if (!newMember.roles.cache.has(role.id)) {
            if(Log) Log.send({ embeds: [new MessageEmbed({
                color: "DARK_RED",
                author: {
                    name: executor.tag,
                    icon_url: executor.avatarURL({ dynamic: true }),
                },
                thumbnail: {
                    url: oldMember.guild.iconURL({ dynamic: true }),
                },
                description: `${role} rolü ${target} kullanıcısından ${executor} tarafından __kaldırıldı.__ `,
                fields: [
                    {
                        name: 'Rol Özellikleri:',
                        value: `\`\`\`• Rol İsmi: ${role.name}\n• Rol Rengi: ${role.hexColor}\n•Rol İzinleri: ${(await Client.RolesPermissionConverter(role.permissions.toArray())).join(", ")} \`\`\` `,
                    },
                    {
                        name: 'Eski Rolleri',
                        value: `${oldMember._roles.map(x => `<@&${x}>`.replace(`<@&${role.id}>`, `__**[Hedef Rol:${role}]**__`))}`,
                    },
                    {
                        name: 'Yeni Rolleri',
                        value: `${!newMember._roles.length ? "@everyone" : newMember._roles.map(x => `<@&${x}>`)}`,
                    }
                ],
                footer: {
                    text: target.tag,
                    icon_url: target.avatarURL({ dynamic: true })
                }
            })], components: [row] }).then(async Msg => {
                await UserLog.findOneAndUpdate({ _Id: target.id }, { $push: { "Roles": { Admin: executor.id, Date: Date.now(), Type: "manuel", Process: "remove", Role: role.id, Log: Msg.url } } }, { upsert: true, new: true, setDefaultsOnInsert: true });
            }).catch(() => {});
        };
    });
}