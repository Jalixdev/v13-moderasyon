const {MessageEmbed} = require('discord.js')
const cfg = require("../../Config.json")

module.exports = {
    name: 'say',
    description: "Sunucu istatistikleri görüntülenir.",
    category: "User",
    aliases: ['say','count'],
    run: async(client, message, args) => {

        let tag1 = await message.guild.members.cache.filter(member => member.user.username.includes(cfg.Tags.tagsay)).size;
        let tag2 = await message.guild.members.cache.filter(member => member.user.username.includes(cfg.Tags.tagsay2)).size;
        //let tag3 = await message.guild.members.cache.filter(member => member.user.username.includes(cfg.Tags.tagsay3)).size;
        //let tag4 = await message.guild.members.cache.filter(member => member.user.username.includes(cfg.Tags.tagsay4)).size;
        var etag = message.guild.members.cache.filter(u => u.user.discriminator.includes(cfg.Tags.Number)).size;

        message.channel.send({ embeds: [new MessageEmbed({
            thumbnail: { 
                url: message.guild.iconURL({ dynamic: true })
            },
            color: "DARK_NAVY",
            description: `\`❯\` Sunucumuzda toplam **${message.guild.memberCount}** üye bulunmaktadır.
\`❯\` Sunucuda online **${message.guild.members.cache.filter(x => (x.presence && x.presence.status !== "offline")).size}** üye bulunmaktadır.
\`❯\` Tagımızda **(${tag1+tag2+etag})** kişi bulunmakta [${tag1+tag2} taglı **${etag}** etiket]
\`❯\` Ses kanallarında **${message.guild.members.cache.filter(x => x.voice.channel).size}** üye bulunmaktadır`
        })] }).Delete(20);
    }
}