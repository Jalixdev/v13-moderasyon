const { MessageButton, MessageActionRow } = require("discord.js");
const time = new Map()
module.exports = {
  name: "tag",
  aliases: ["t", "taggöster"], 
  run: async (client, message, args, EmojiData, LogData, Config, RolData) => {
    if(time.has(message.member.id)) return await message.delete().catch(() => {});
    let buttons = [];
    for(var i = 0;Config.Tags.Other.length > i ;i++){
      buttons.push(new MessageButton({ style: "SECONDARY", label: Config.Tags.Other[i], customId: Config.Tags.Other[i] }));
    };
    buttons.push(new MessageButton({ style: "SECONDARY", label: "#"+Config.Tags.Number, customId: "#"+Config.Tags.Number }));
    let jalixtag = new MessageActionRow().addComponents(...buttons);
    let Msg = await message.channel.send({ components: [jalixtag] });
    const collector = await Msg.createMessageComponentCollector({
      componentType: 'BUTTON',
      time: 1000*30
    });
    time.set(message.member.id);
    setTimeout(async() => {
      time.delete(message.member.id);
      await message.delete().catch(() => {});
      await Msg.delete().catch(() => {});
    }, 15000)
    collector.on("collect", i => {
      i.reply({ content: `${i.customId}`, ephemeral: true });
    })
  }
};