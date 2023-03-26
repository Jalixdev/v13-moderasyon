const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
  name: "avatar",
  description: "Kullanıcı avatarı görüntülersiniz.",
  category: "User",
  aliases: ["foto", "profilfoto"], 
  run: async (client, message, args) => {
    let Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let URL = new MessageButton({ style: "LINK", url: Member.user.avatarURL({ dynamic: true }), label: "Resim Adresi" });
    message.channel.send({ embeds: [new MessageEmbed({ color: "0x36393E", image: { url: Member.displayAvatarURL({ dynamic: true, size: 1024 })}})], components: [new MessageActionRow().addComponents(URL)] })
  }
};