const monggose = require('mongoose');
const Config = global.Config = require('./Config');
const { Client, Collection } = require('discord.js');
const fs = require("fs");
const client = global.client = new Client({ 
  fetchAllMembers: true,
  intents: [98303]
});
const discordModals = require('discord-modals');
discordModals(client);
const commands = (client.commands = new Collection());
const aliases = (client.aliases = new Collection());

require('./Function/Global');
require('./Function/Process');
require('./Function/FetchData');

monggose.connect(Config.Bot.Mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('[+] Database bağlantısı kuruldu.'))
client.login(Config.Bot.Token).then(() => console.log("[+] " + client.user.tag + " bot başarıyla giriş yaptı."));

fs.readdirSync("./Commands", { encoding: "utf8" }).forEach(files => {
  fs.readdirSync(`./Commands/${files}`, { encoding: "utf8" }).filter(file => file.endsWith(".js")).forEach(file => {
    let command = require(`./Commands/${files}/${file}`);
    if (!command.name) return console.log(`Hatalı Kod Dosyası => [/Commands/${files}]`);
commands.set(command.name, command);
    if (!command.aliases || command.aliases.length < 1) return;
    command.aliases.forEach(otherUses => {
      aliases.set(otherUses, command.name);
    });
  })
});


const event = evnt => require(`./Events/${evnt}`);
const System = evnt => require(`./Events/System/${evnt}`);
client.on("ready", event("Penal"));
client.on("guildMemberAdd", event("Join"));
client.on("guildMemberRemove", event("Leave"));
client.on("messageCreate", event("Afk"));
client.on("voiceStateUpdate", event("Voice-Log"));
client.on("userUpdate", event("Auto-Tag"));
client.on("guildMemberUpdate", event("Rol-Log"));
client.on("messageCreate", System("Message"));
client.on("ready", System("Ready"));