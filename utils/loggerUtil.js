const { MessageEmbed } = require('discord.js');

module.exports.green = async (client, title, fields) => {
    const embed = new MessageEmbed();
    embed.setColor('#34eb46');
    embed.setTitle(title);
    embed.setFields(fields);
    embed.setFooter('Uitgevoerd op');
    embed.setTimestamp();
    
    const channel = await client.channels.fetch(client.config['log-channel']);
    await channel.send({
        embeds: [embed]
    });
}

module.exports.red = async (client, title, fields) => {
    const embed = new MessageEmbed();
    embed.setColor('#eb3434');
    embed.setTitle(title);
    embed.setFields(fields);
    embed.setFooter('Uitgevoerd op');
    embed.setTimestamp();
    
    const channel = await client.channels.fetch(client.config['log-channel']);
    await channel.send({
        embeds: [embed]
    });
}

module.exports.orange = async (client, title, fields) => {
    const embed = new MessageEmbed();
    embed.setColor('#eb8f34');
    embed.setTitle(title);
    embed.setFields(fields);
    embed.setFooter('Uitgevoerd op');
    embed.setTimestamp();
    
    const channel = await client.channels.fetch(client.config['log-channel']);
    await channel.send({
        embeds: [embed]
    });
}

module.exports.custom = async (client, properties) => {
    const channel = await client.channels.fetch(client.config['log-channel']);
    await channel.send(properties);
}