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
        await interaction.deferUpdate();
        return this.closeTicket(interaction);
      case "cancel-ticket-close":
        return this.cancelCloseTicket(interaction);
      case "close-options-transcript":
        await interaction.deferUpdate();
        return this.createTranscript(interaction);
      case "close-options-delete":
        await interaction.deferUpdate();
        return this.deleteTicket(interaction);
      case "cancel-ticket-delete":
        return this.cancelDeleteTicket(interaction);
    }
  }

  async deleteTicket(interaction) {
    const channel = interaction.channel;
    const executor = interaction.member;

    const embed = await this.client.ticketUtils.deleteTicket(
      this.client,
      channel,
      executor
    );

    if (!embed) return;

    const cancelButton = new MessageButton();
    cancelButton.setCustomId("cancel-ticket-delete");
    cancelButton.setLabel("Annuleren");
    cancelButton.setStyle("SECONDARY");
    cancelButton.setEmoji("📛");

    const row = new MessageActionRow();
    row.addComponents(cancelButton);

    await channel.send({
      embeds: [embed],
      components: [row]
    });
  }

  async createTranscript(interaction) {
    const file = await this.client.ticketUtils.createTranscript(
      this.client,
      interaction.channel
    );
    await interaction.channel.send({
      embeds: [this.client.embedUtils.createEmbed(this.client).setTitle('De transcript is gemaakt en bijgevoegd aan dit bericht.')],
      files: [file]
    });
  }

  async cancelCloseTicket(interaction) {
    await this.client.ticketUtils.cancelClose(interaction.channel);
    await interaction.reply({
      content: "✅ Sluiten geannuleerd!",
      ephemeral: true,
    });
    await interaction.message.delete();
  }

  async cancelDeleteTicket(interaction) {
    await this.client.ticketUtils.cancelDelete(interaction.channel);
    await interaction.reply({
      content: "✅ Verwijderen geannuleerd!",
      ephemeral: true,
    });
    await interaction.message.delete();
  }

  async closeTicket(interaction) {
    const channel = interaction.channel;
    const executor = interaction.member;

    const embed = await this.client.ticketUtils.closeTicket(
      this.client,
      channel,
      executor
    );

    if (!embed) return false;

    const cancelButton = new MessageButton();
    cancelButton.setCustomId("cancel-ticket-close");
    cancelButton.setLabel("Annuleren");
    cancelButton.setStyle("SECONDARY");
    cancelButton.setEmoji("📛");

    const row = new MessageActionRow();
    row.addComponents(cancelButton);

    const response = await channel.send({
      embeds: [embed],
      components: [row]
    });
    setTimeout( async () => {
      await response.delete();
    }, 10000);
    return true;
  }
};
