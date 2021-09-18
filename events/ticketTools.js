const { Event } = require("../handlers/eventhandler");
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = class TicketToolsEvent extends Event {
  constructor(client) {
    super(client, "interactionCreate", "on");
  }

  async execute(interaction) {
    if (!interaction.isButton()) return;

    const customId = interaction.customId;
    switch (customId) {
      case "close-ticket":
        return this.closeTicket(interaction);
      case "cancel-ticket-close":
        return this.cancelCloseTicket(interaction);
      case "close-options-transcript":
        return this.createTranscript(interaction);
    }
  }

  async createTranscript(interaction) {
    await this.client.ticketUtils.createTranscript(
      this.client,
      interaction.channel
    );
  }

  async cancelCloseTicket(interaction) {
    await this.client.ticketUtils.cancelClose(interaction.channel);
    await interaction.reply({
      content: "✅ Sluiten geannuleerd!",
      ephemeral: true,
    });
    await interaction.message.delete();
  }

  async closeTicket(interaction) {
    const channel = interaction.channel;
    const executor = interaction.member;

    const embed = await this.client.ticketUtils.closeTicket(
      this.client,
      channel
    );

    const cancelButton = new MessageButton();
    cancelButton.setCustomId("cancel-ticket-close");
    cancelButton.setLabel("Annuleren");
    cancelButton.setStyle("SECONDARY");
    cancelButton.setEmoji("📛");

    const row = new MessageActionRow();
    row.addComponents(cancelButton);

    interaction
      .reply({
        embeds: [embed],
        components: [row],
      })
      .then((result) => setTimeout(() => result.delete(), 1000 * 10));
  }
};
