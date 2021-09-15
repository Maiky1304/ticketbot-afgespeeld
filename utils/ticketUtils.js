const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

const ticketsClosing = [],
  ticketsDelete = [];

module.exports.closeTicket = async (client, channel) => {
  const embed = new MessageEmbed();
  embed.setTitle("De ticket wordt over 10 seconden gesloten...");
  embed.setColor(client.config.themecolor);
  ticketsClosing.push(channel.id);
  setTimeout(async () => {
    if (ticketsClosing.includes(channel.id)) {
      const categoryData = require("../ticketcategories.json");
      const category = categoryData.find(
        (entry) => entry["category-id"] === channel.parent.id
      );
      if (!category) return;
      await channel.edit({
        permissionOverwrites: [
          {
            id: client.config["everyone-role-id"],
            deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
            type: "role",
          },
          {
            id: category["role-id"],
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
            type: "role",
          },
        ],
      });

      const embed = new MessageEmbed();
      embed.setTitle("De ticket is gesloten!");
      embed.setColor(client.config.themecolor);

      const closeOptions = new MessageActionRow();

      const deleteTicket = new MessageButton();
      deleteTicket.setLabel("Verwijder ticket");
      deleteTicket.setEmoji("🗑️");
      deleteTicket.setStyle("DANGER");
      deleteTicket.setCustomId("close-options-delete");

      closeOptions.addComponents(deleteTicket);

      await channel.send({
        embeds: [embed],
        components: [closeOptions],
      });
    }
  }, 1000 * 10);
  return embed;
};

module.exports.cancelClose = (channel) => {
  const index = ticketsClosing.indexOf(channel.id);
  if (index > -1) {
    ticketsClosing.splice(index, index + 1);
  }
};

module.exports.deleteTicket = async (client, channel) => {
  const embed = new MessageEmbed();
  embed.setTitle("De ticket wordt over 10 seconden verwijderd...");
  embed.setColor(client.config.themecolor);
  ticketsDelete.push(channel.id);
  setTimeout(async () => {
    if (ticketsDelete.includes(channel.id)) {
      await channel.delete();
    }
  }, 1000 * 10);
  return embed;
};
