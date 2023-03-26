const { MessageSelectMenu, MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');

module.exports = {
    name: "role-check",
    description: "Kullanıcı rol kontrolü yaparsınız.",
    category: "Admin",
    aliases: ['rolsüzver', "taglı", "rolsüz", "kontrol"], 
    run: async (client, message, args, EmojiData, LogData, Config, RolData) => {
        let Emb = new MessageEmbed({
            color: "BLACK",
            author: {
              name: "Control Panel",
              icon_url: message.author.avatarURL({ dynamic: true })
            },
        });
        if(message.member.Permissions(Config.Roles.Authorized.Management) === false) return;

        let Menü = new MessageSelectMenu()
        .setCustomId("check")
        .setPlaceholder("Seçiniz!")
        .addOptions([
            { label: "Rolsüz", value:"rolsüz", description: "Sunucuda Rolü Olmayan Kullanıcılara Kayıtsız Rolü Verir." },
            { label: "Etkinlik & Çekiliş", value:"etkinlik", description: "Sunucuda Etkinlik&Çekiliş Rolü Olmayan Kullanıcılara Rolleri Verir." },
            { label: "Taglı", value:"taglı", description: "Sunucuda Tag Kontrolü Yapar.."},
        ])
        .setMinValues(1)
        .setMaxValues(3);
        let row = new MessageActionRow().addComponents(Menü);

        let Msg = await message.channel.send({ embeds: [Emb.setColor("0x36393E").setDescription(`Sunucu Kontrol Paneli Üzerinden sunucu içi rol kontrollerini manipüle edebilirsiniz.
        
\`• Rolsüz              :\` \`  ${message.guild.members.cache.filter(member => !member._roles.length).size}  \`
\`• Etkinlik & Çekiliş  :\` \`         Roller Ayarlanmadı       \` 
\`• Taglı               :\` \`Taglı & Rolsüz: ${message.guild.members.cache.filter(member => member.nameCheck() === true && !member.roles.cache.has(Config.Roles.General.Family[0])).size} || Tagsız & Rollü: ${message.guild.members.cache.filter(member => member.nameCheck() === false && member.roles.cache.has(Config.Roles.General.Family[0])).size} \`  
        `)], components: [row] });

        const collector = await Msg.createMessageComponentCollector({
            componentType: 'SELECT_MENU',
            filter: (component) => component.user.id === message.author.id,
            time: 1000*60
        });
        collector.on('collect', async(i) => {
            let One = new MessageButton({ style: "SECONDARY", emoji: "1️⃣", customId: "taglırolsüz" })
            let Two = new MessageButton({ style: "SECONDARY", emoji: "2️⃣", customId: "tagsızrollü" })
            let row = new MessageActionRow().addComponents(One, Two);
            let msg = await i.reply({ content: `${i.values.find(x => x === "etkinlik") ? "Etkinlik ve Çekişiş Katılımcı Rolleri Ayarlı Değil\n " : ""}${i.values.find(x => x === "rolsüz") ? "Rol Dağıtım işlemi Tamamlandı!\n": ""}${i.values.find(x => x === "taglı") ? "Tagı olup rolü olmayanları kontrol etmek için \\1️⃣ butonuna, tagı olmayıp rolü olanları kontrol etmek için \\2️⃣ butonuna basınız.": ""}`, components: i.values.find(x => x === "taglı") ? [row] : [], ephemeral: true, fetchReply: true });
            const collector = await msg.createMessageComponentCollector({
                componentType: 'BUTTON',
                filter: (component) => component.user.id === message.author.id,
                time: 1000*60
            });
            collector.on('collect', async(ib) => {
                if(ib.customId === "taglırolsüz") {
                    ib.reply({ content: "İşlem Başarılı", ephemeral: true })
                     message.guild.members.cache.filter(member => member.nameCheck() === true && !member.roles.cache.has(Config.Roles.General.Family[0])).forEach(member => {
                         member.roles.add(Config.Roles.General.Family).catch(() => {});
                     });
                 };
                 if(ib.customId === "tagsızrollü") {
                     ib.reply({ content: "İşlem Başarılı", ephemeral: true })
                     message.guild.members.cache.filter(member => member.nameCheck() === false && member.roles.cache.has(Config.Roles.General.Family[0])).forEach(member => {
                         Config.Tags.TagMust === true ?  
                         member.setRoles(Config.Roles.General.Unregister).catch(() => {})
                          :
                         member.roles.remove(message.guild.roles.cache.filter(x => x.rawPosition > message.guild.roles.cache.get(Config.Roles.Authorized.MinStaffRole).rawPosition).filter(x => member.roles.cache.has(x.id)).map(x => x.id)).catch(() => {})
                            member.roles.remove(Config.Roles.General.Family).catch(() => {})
                      })
                  }
              })
              if(i.values.find(x => x === "rolsüz")) {
                  message.guild.members.cache.filter(member => !member._roles.length).forEach(member => {
                      member.roles.add(Config.Roles.General.Unregister).catch(() => {});
                      if(member.nameCheck() === true)member.roles.add(Config.Roles.General.Family).catch(() => {});
                  });
              };    
        });
    }
  };