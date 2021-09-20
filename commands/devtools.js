const { Command } = require('../handlers/commandhandler');

const { MessageButton, MessageActionRow } = require('discord.js');

module.exports = class DevToolsCommand extends Command {

    constructor(client) {
        super(client, 'devtools', 'Speciaal menutje voor testen', 'ADMINISTRATOR');
    }

    async execute(message, _label, _args) {
        const embed = this.client.embedUtils.createEmbed(this.client);
        embed.setTitle('Developer Menu');

        const row = new MessageActionRow();
        
        const channelInfoBtn = new MessageButton();
        channelInfoBtn.setCustomId('devmenu-ticketinfo');
        channelInfoBtn.setLabel('MongoDB Info Channel');
        channelInfoBtn.setEmoji('📰');
        channelInfoBtn.setStyle('PRIMARY');

        row.addComponents(channelInfoBtn);

        await message.channel.send({
            embeds: [embed],
            components: [row]
        });
    }

}