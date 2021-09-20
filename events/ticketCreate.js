const { Event } = require("../handlers/eventhandler");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

const builders = require('@discordjs/builders');

const Ticket = require('../models/ticket');

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

    // create database entry
    const ticket = new Ticket({
      channelId: ticketChannel.id,
      guildId: ticketChannel.guild.id,
      ticketCreator: interaction.member.id,
      open: true
    });
    await ticket.save();

    // send info messages in channel
    const embed = new MessageEmbed();
    embed.setColor(this.client.config.themecolor);
    embed.setTitle("Ticket - " + ticketId);
    embed.setDescription(
      `Welkom in je ticket ${interaction.member.toString()}.\n \n🛠️ **Commands**\n> ${builders.inlineCode(this.client.config.prefix + 'close')} - Sluit de ticket hiermee\n> ${builders.inlineCode(this.client.config.prefix + 'add <gebruiker>')} - Voeg iemand hiermee toe aan de ticket\n> ${builders.inlineCode(this.client.config.prefix + 'remove <gebruiker>')} - Verwijder iemand hiermee uit de ticket`
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

    await this.client.logger.green(this.client, 'Ticket geopend', [
      {
        name: 'Geopend door',
        value: interaction.member.toString(),
        inline: false
      },
      {
        name: 'Channel',
        value: ticketChannel.toString(),
        inline: false
      }
    ]);

    const header = await ticketChannel.send({
      content: interaction.member.toString(),
      embeds: [embed],
      components: [row],
    });
    const question = await ticketChannel.send({
      embeds: [
        this.client.embedUtils.createEmbed(this.client)
        .setTitle('Wat is je vraag?')
      ]
    });

    const filter = m => m.author.id === interaction.member.id;
    const collector = ticketChannel.createMessageCollector({ filter, max: 1 });
    collector.on('end', async (collected) => {
      const { content } = collected.first();
      embed.addField('Vraag', content.length > 1024 ? `${content.slice(0, 1021)}...` : content, true);
      await header.edit({
        content: interaction.member.toString(),
        embeds: [embed],
        components: [row],
      });
      await question.delete();
      await collected.first().delete();
    });
  }
};
