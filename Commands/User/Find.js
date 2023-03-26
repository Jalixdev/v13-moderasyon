const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
module.exports = {
  name: "bul",
  description: "Kullanıcının bulunduğu ses kanalını görüntülersini.",
  category: "User",
  aliases: ["find", "nerede", "n"], 
  run: async (client, message, args, EmojiData, LogData, Config, RolData) => {
    let Emb = new MessageEmbed({ 
      author: {
        name: message.author.tag,
        icon_url: message.author.avatarURL({ dynamic: true })
      },
      timestamp: Date.now()
    });
    let Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if(!Member.voice.channel || !Member.voice.channel.permissionsFor(message.author.id).has("VIEW_CHANNEL")) return message.react("🔇").catch(() => {})
    let invite = await Member.voice.channel.createInvite();
    let Git = new MessageButton({ style: "LINK", url: `https://discord.gg/${invite.code}`, label: "Gitmek İçin Tıkla" });
    let Detay = new MessageButton({ style: "SECONDARY", emoji: "📦", customId: "detay" });
    let Msg = await message.channel.send({content: `\`@${Member.displayName}\` kullanıcısı şuanda <#${Member.voice.channel.id}> kanalında ${Member.voice.deaf === true ? "AFK." : "aktif."}`, components: [new MessageActionRow().addComponents(Git, Detay)] })
    const collector = await Msg.createMessageComponentCollector({
      componentType: 'BUTTON',
      filter: (component) => component.user.id === message.author.id,
      time: 1000*30
    });
    setTimeout(() => {
      Msg.delete().catch(() => {});
    }, 20000)
    collector.on('collect', async(i) => {
      if(i.customId !== "detay") return;
      await Msg.delete().catch(() => {});
      await i.reply({ embeds: [new MessageEmbed({
            author: {
              name: Member.user.tag,
              icon_url: Member.user.avatarURL({ dynamic: true })
            },
            color: "DARK_ORANGE",
            description: `${message.author.id === Member.id ? `Selam \`${message.author.username}\`, ses bilgileriniz aşağıda verilmiştir arkadaşlarınızın odaya giriş yapması için [tıklaması](https://discord.com/channels/${Config.Guild.Id}/${Member.voice.channel.id}) yeterli olacaktır.` : `Selam \`${message.author.username}\`, bakmış olduğunuz ${Member} kullanıcısının ses bilgileri aşağıda verilmiştir odaya giriş yapmak için [tıklamanız](https://discord.com/channels/${Config.Guild}/${Member.voice.channel.id}) yeterli olacaktır.`}
          \`\`\`h
# kullanıcı "${Member.voice.channel.name}" adlı kanalda yer alıyor!\`\`\`\`\`\`diff
+ Mikrofon durumu: ${Member.voice.mute ? "Kapalı" : "Açık"}
    > Sunucu Susturması: ${Member.voice.serverMute ? "Susturulmuş" : "Susturulmamış"}
    > Kişisel Susturması ${Member.voice.selfMute ? "Susturmuş" : "Susturmamış"}
+ Kulaklık durumu: ${Member.voice.deaf ? "Kapalı" : "Açık"}
    > Sunucu Sağırlaştırması: ${Member.voice.serverDeaf ? "Sağırlaştırılmış" : "Sağırlaştırılmamış"}
    > Kişisel Sağırlaştırması ${Member.voice.selfDeaf ? "Sağırlaştırmış" : "Sağırlaştırmamış"}
+ Video durumu: ${Member.voice.selfVideo ? "Açık" : "Kapalı"}

+ Yayın durumu: ${Member.voice.streaming ? "Açık" : "Kapalı"}
         
+ Odaya giriş izniniz: ${Member.voice.channel.permissionsFor(Member.id).has("CONNECT") ? "Kanala Katılabilirsiniz." : "Kanala Katılamazsınız."}
    > Oda Limiti: ${Member.voice.channel.userLimit || "Sonsuz"}
    > Odadaki üye sayısı: ${Member.voice.channel.members.size}\`\`\`\`\`\`h
# odadaki diğer kullanıcılar:\`\`\`\`\`\`css
User   ||  User ID  ||  Bots?
${Member.voice.channel.members.size < 7 ? message.guild.channels.cache.get(Member.voice.channel.id).members.map(x => `${x.user.tag} - [${x.user.id}] [${x.user.bot ? "BOT" : "NON-BOT"}]`).join("\n") : "Listelenemedi!"}
\`\`\``})], ephemeral: true });  
    })
  }
};