const { Command } = require("../handlers/commandhandler");
const builders = require("@discordjs/builders");

module.exports = class TicketAddCommand extends Command {
  constructor(client) {
    super(client, "remove", "Verwijder een member van een ticket");
    super.ticketCommand = true;
  }

  async execute(message, _label, args) {
    const channel = message.channel;

    if (args.length !== 1) {
      await channel.send({
        embeds: [
          this.client.embedUtils
            .createErrorEmbed()
            .setDescription(
              `Gebruik: ${builders.inlineCode(
                this.client.config.prefix + this.label + " <gebruiker>"
              )}`
            ),
        ],
      });
      return;
    }

    if (message.mentions.members.size === 0) {
      await channel.send({
        embeds: [
          this.client.embedUtils
            .createErrorEmbed()
            .setDescription(
              `Gebruik: ${builders.inlineCode(
                this.client.config.prefix + this.label + " <gebruiker>"
              )}`
            ),
        ],
      });
      return;
    }

    const member = message.mentions.members.first();
    const permissions = channel.permissionOverwrites.cache.get(member.id);

    if (!permissions) {
      await channel.send({
        embeds: [
          this.client.embedUtils
            .createErrorEmbed()
            .setDescription(
              "Deze gebruiker is niet toegevoegd aan deze ticket."
            ),
        ],
      });
      return;
    }

    await channel.permissionOverwrites.delete(member.id, "remove from ticket");
    await channel.send({
      embeds: [
        this.client.embedUtils
          .createEmbed(this.client)
          .setTitle("Gebruiker verwijderd!")
          .setDescription(`${member.toString()} is verwijderd uit de ticket.`),
      ],
    });
  }
};
