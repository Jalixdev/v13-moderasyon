
module.exports = {
    name: 'test',
    run: async(client, message, args) => {
        let veri = await message.channel.permissionOverwrites.fetch();
        console.log(veri)
    }
}