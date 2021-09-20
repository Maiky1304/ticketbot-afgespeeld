const { MessageEmbed } = require("discord.js");

module.exports.createEmbed = (client) => {
  const embed = new MessageEmbed();
  embed.setColor(client.config.themecolor);
  return embed;
};

module.exports.createErrorEmbed = () => {
  const embed = new MessageEmbed();
  embed.setTitle("Error");
  embed.setColor("#e80e0e");
  return embed;
};

module.exports.processObject = (obj) => {
  const embed = new MessageEmbed();
  embed.setTitle('Overzicht van de data:');
  for (const key in obj) {
    const value = obj[key];
    embed.addField(key.toString(), value ? (value.toString().length > 1024 ? value.toString().slice(0, 1021) + '...' : value.toString()) : '???', true);
  }
  return embed;
}