const { Event } = require('../handlers/eventhandler');
const Ticket = require('../models/ticket');

module.exports = class DeveloperToolsEvent extends Event {
    
    constructor(client) {
        super(client, 'interactionCreate', 'on');
    }

    async execute(interaction) {
        if (!interaction.isButton()) return;

        const customId = interaction.customId;
        switch(customId) {
            case "devmenu-ticketinfo":
                return this.ticketInfo(interaction);
        }
    }

    async ticketInfo(interaction) {
        const channel = interaction.channel;
        const ticket = await Ticket.findOne({channelId: channel.id});

        if (!ticket) {
            await interaction.reply({ content: 'Dit is geen ticket!', ephemeral: true });
            return;
        }

        const embed = this.client.embedUtils.processObject(ticket);
        interaction.reply({ embeds: [embed], ephemeral: true });
    }

}