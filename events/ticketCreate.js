const { Event } = require("../handlers/eventhandler");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = class TicketCreateEvent extends Event {
  constructor(client) {
    super(client, "interactionCreate", "on");
  }

  async execute(interaction) {
    if (!interaction.isButton()) return;

    const buttonId = interaction.customId;
    if (!buttonId.startsWith("ticketembed:")) return;

    const categoryId = buttonId.slice("ticketembed:".length);

    const categoryData = require("../ticketcategories.json");
    const category = categoryData.find(
      (entry) => entry["category-id"] === categoryId
    );

    if (!category) return;

    const guild = interaction.guild;
    const ticketId = interaction.member.user.username.toLowerCase();
    const ticketChannel = await guild.channels.create(`ticket-${ticketId}`, {
      parent: categoryId,
      permissionOverwrites: [
        {
          id: this.client.config["everyone-role-id"],
          deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
          type: "role",
        },
        {
          id: interaction.member.id,
          allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
          type: "member",
        },
        {
          id: category["role-id"],
          allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
          type: "role",
        },
      ],
    });

    // send info messages in channel
    const embed = new MessageEmbed();
    embed.setColor(this.client.config.themecolor);
    embed.setTitle("Ticket gemaakt!");
    embed.setDescription(
      "Stel je vraag hier zo duidelijk mogelijk zodat je zo snel mogelijk geholpen kan worden."
    );
    embed.setTimestamp();
    embed.setFooter("Bot by Maiky");

    const closeTicket = new MessageButton();
    closeTicket.setCustomId("close-ticket");
    closeTicket.setEmoji("🔒");
    closeTicket.setLabel("Sluit ticket");
    closeTicket.setStyle("PRIMARY");

    const row = new MessageActionRow();
    row.addComponents([closeTicket]);

    await ticketChannel.send({
      content: interaction.member.toString(),
      embeds: [embed],
      components: [row],
    });
  }
};
