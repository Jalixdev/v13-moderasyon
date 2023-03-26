const { MessageEmbed, MessageButton, MessageSelectMenu, Client } = require('discord.js');
const GuildLog = require('..//Database/GuildLog');
const UserLog = require('..//Database/UserLog');
const client = global.client;

module.exports = async(oldUser, newUser) => {
    let Log = await client.SearchChannels(global.Log.Tag)
    let Member = client.guilds.cache.get(global.Config.Guild.Id).members.cache.get(newUser.id);
    let Status = await  Member.nameCheck();
    if(Status === false) {
        global.Config.Tags.TagMust === true ?  
        Member.setRoles(global.Config.Roles.General.Unregister)
        :
        Member.roles.remove(Member.guild.roles.cache.filter(x => x.rawPosition > client.guilds.cache.get(global.Config.Guild.Id).roles.cache.get(global.Config.Roles.Authorized.MinStaffRole).rawPosition).filter(x => Member.roles.cache.has(x.id)).map(x => x.id)).catch(() => {});
        Member.roles.remove(global.Config.Roles.General.Family);
        if((global.Config.Tags.Other.some(ss => oldUser.username.toLowerCase().includes(ss)) || oldUser.discriminator == global.Config.Tags.Number) && (!global.Config.Tags.Other.some(ss => newUser.username.toLowerCase().includes(ss)) || newUser.discriminator != global.Config.Tags.Number)) {
           
            let Roles = new MessageButton({ style: "PRIMARY", label: "Rolleri Geri Ver", customId: "remove" });
            let İlgilen = new MessageButton({ style: "PRIMARY", label: "İlgilen", customId: "remove" });
        
            if(Log) Log.send({ embeds: [new MessageEmbed({ 
                author: {
                    name: Member.guild.name,
                    icon_url: Member.guild.iconURL({ dynamic: true })
                },
                color: "RED",
                description: `${Member} isimli kullanıcı tagımızı <t:${Math.floor(Date.now() / 1000)}:R> bıraktı. Kullanıcıyla ilgilenmek isteyen yetkililer aşağıdaki butonu kullanabilir.
                
\`İsim Değişikliği :\` \`${oldUser.username.replace("`", "\\`")}#${oldUser.discriminator} ==> ${newUser.username.replace("`", "\\`")}#${newUser.discriminator}\` 
\`Güncel Taglı Üye :\` \`${Member.guild.members.cache.filter(x => x.nameCheck() === true).size}\` 
\`Yapılan İşlem    :\` \` ${global.Config.Tags.TagMust === true ? "Yetkili Rolleri Alındı ve Kayıtsıza Atıldı" : "Yetkili Rolleri ALındı"} \`
                `,
                fields: [
                    {
                        name: `Kullanıcı Üzerinden Çekilen Roller:`,
                        value: `<@&${global.Config.Roles.General.Family}>, ${global.Config.Tags.TagMust === true ? Member._roles.map(x => `<@&${x}>`) : Member.guild.roles.cache.filter(x => x.rawPosition > client.guilds.cache.get(global.Config.Guild.Id).roles.cache.get(global.Config.Roles.Authorized.MinStaffRole).rawPosition).filter(x => Member.roles.cache.has(x.id)).map(x => x)}`,
                    }
                ] 
            })] });
        }
    } else if(Status === true) {
        Member.roles.add(global.Config.Roles.General.Family).catch(() => {});
        if((!global.Config.Tags.Other.some(ss => oldUser.username.toLowerCase().includes(ss)) || oldUser.discriminator != global.Config.Tags.Number) && (global.Config.Tags.Other.some(ss => newUser.username.toLowerCase().includes(ss)) || newUser.discriminator == global.Config.Tags.Number)) {
       
            let Roles = new MessageButton({ style: "PRIMARY", label: "Rolleri Geri Ver", customId: "remove" });
            let İlgilen = new MessageButton({ style: "PRIMARY", label: "İlgilen", customId: "remove" });
            
            if(Log) Log.send({ embeds: [new MessageEmbed({ 
                author: {
                    name: Member.guild.name,
                    icon_url: Member.guild.iconURL({ dynamic: true })
                },
                color: "GREEN",
                description: `${Member} isimli kullanıcı tagımızı <t:${Math.floor(Date.now() / 1000)}:R> aldı. Kullanıcıyı ekibinize almak için aşağıdaki butonu kullanabilirsiniz.

\`İsim Değişikliği :\` \`${oldUser.username.replace("`", "\\`")}#${oldUser.discriminator} ==> ${newUser.username.replace("`", "\\`")}#${newUser.discriminator}\` 
\`Güncel Taglı Üye :\` \`${Member.guild.members.cache.filter(x => x.nameCheck() === true).size}\` 
\`Yapılan İşlem    :\` \` Crew Rolü Verildi \`
                `
            })] });
        }
    }

}