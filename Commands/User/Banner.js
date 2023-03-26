const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const fetch = require('node-fetch');
module.exports = {
  name: "banner",
  description: "Kullanıcı bannerı görüntülersiniz.",
  category: "User",
  aliases: ["kullanıcıbanner", "arkaplan"], 
  run: async (client, message, args) => {
    let Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let uid = Member.id
    let response = fetch(`https://discord.com/api/v10/users/${uid}`, {
      method: 'GET',
      headers: {
        Authorization: `Bot ${client.token}`
      }
    });
    let receive = ''
    var banner = 'https://cdn.discordapp.com/attachments/829722741288337428/834016013678673950/banner_invisible.gif' // invisible image ( you can change the link if you want )
    response.then(a => {
      if(a.status !== 404) {
        a.json().then(data => {
          receive = data['banner']
          if(receive !== null) {
            let format = 'png'
            if(receive.substring(0,2) === 'a_') {
              format = 'gif'
            }
            banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.${format}?size=1024`
          };
        });
      };
    });
    setTimeout(async() => {
      if(banner === "https://cdn.discordapp.com/attachments/829722741288337428/834016013678673950/banner_invisible.gif") return message.channel.send({ content: `${Member.id === message.author.id ? "Banneriniz bulunmamakta!" : "Bannerına bakmak istediğiniz kullanıcının banneri bulunmamakta!"}` })
      let URL = new MessageButton({ style: "LINK", url: banner, label: "Resim Adresi" });
      message.channel.send({ embeds: [new MessageEmbed({ color: "0x36393E", image: { url: banner} })], components: [new MessageActionRow().addComponents(URL)] })
    }, 500)
  }
};