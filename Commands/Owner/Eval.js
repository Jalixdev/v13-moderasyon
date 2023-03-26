const { MessageEmbed, MessageAttachment } = require("discord.js");
module.exports = {
  name: "eval",
  aliases: ['ıamgod'], 
  run: async (client, message, args) => {
    if(!global.Config.Bot.Owner.some(ID => message.author.id === ID)) return;
    let Embed = new MessageEmbed().setColor("2F3136")
    let Code = args.join(" "); if(!Code) return;
    function clean(text) {
      if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
      text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
      return text;
    };
    try {
      var evaled = clean(await eval(Code)).replace(/[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g,"-TOKEN-");
      if(evaled.length > 2000) {
        let File = new MessageAttachment(Buffer.from(`İnput: ${Code}\nOutput: ${evaled.replace(/[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g,"-TOKEN-")}`,'utf-8'),'eval.js');
        return await message.reply({files:[File]});
      } else {
        return await message.reply({embeds: [Embed.setDescription(`**İnput:** \`\`\`js\n${Code}\`\`\`\n**Output:** \`\`\`js\n${evaled.replace(/[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g,"-TOKEN-")}\`\`\``)]});
      }
    } catch(err) {
      return await message.reply({embeds: [Embed.setDescription(`\`\`\`js\n${err}\`\`\``)]});
    }
  }
};