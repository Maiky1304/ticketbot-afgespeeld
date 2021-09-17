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
