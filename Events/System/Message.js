const { MessageEmbed } = require('discord.js');

module.exports = async message => {
  let client = global.client;
  if (!message.guild || message.author.bot) return;
  if([".", "!"].some(Prfx => message.content.startsWith(Prfx))) {
    
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd) return;
    let EmojiData = global.Emoji, LogData = global.Log, RolData = global.Rol, Config = global.Config;
    cmd.run(client, message, args, EmojiData , LogData, Config, RolData);
  
  /*  if(!LogData) return;
    let CommandLog = client.guilds.cache.get(Config.Guild.Id).channels.cache.get(LogData.Command);
    if(CommandLog) CommandLog.send({ embeds: [new MessageEmbed({
      color: "2F3136",
      description: `👤 [ [\`  ${message.member.displayName}  \`](https://discord.com/users/${message.member.id})  ] kullanıcısı __<t:${Math.floor(Date.now() / 1000)}:f>__ tarihinde ${message.channel} kanalında bir komut kullandı.\n\`\`\`${message.content}\`\`\``
    })] });*/
  }
}