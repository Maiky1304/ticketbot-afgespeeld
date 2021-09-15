const { Command } = require('../handlers/commandhandler');

const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

module.exports = class CreateTicketEmbedCommand extends Command {

    constructor(client) {
        super(client, 'ticketembed', 'Maak de ticket embed (let op de oude doet het dan niet meer)', 'ADMINISTRATOR');
    }

    async execute(message, label, args) {
        // Get bot user as member instead of ClientUser
        const botMember = message.guild.members.cache.has(this.client.user.id) ? message.guild.members.cache.get(this.client.user.id)
        : await message.guild.members.fetch(this.client.user.id);

        // Check if bot can send embed in this channel
        if (!message.channel.permissionsFor(botMember)
        .has('SEND_MESSAGES', false)) {
            await message.reply({
                content: 'De bot kan hier geen berichten sturen, check de permissions voor de bot.',
                ephemeral: true
            });
            return;
        }

        // Create Embed
        const embed = new MessageEmbed();
        embed.setTitle('Ticket aanmaken');
        embed.setDescription('Kies de categorie die hoort bij jouw vraag om zo snel mogelijk antwoord te krijgen op jouw vraag.');
        embed.setColor(this.client.config.themecolor);
        
        const buttons = [];
        const categories = require('../ticketcategories.json');
        for (const category of categories) {
            const button = new MessageButton();
            button.setCustomId(`ticketembed:${category['category-id']}`);
            button.setLabel(category.name);
            button.setEmoji(category.emoji);
            button.setStyle(category['btn-color']);
            console.log(button);
            buttons.push(button);
        }
        const row = new MessageActionRow();
        row.addComponents(buttons);

        // Send embed
        await message.channel.send({
            embeds: [embed],
            components: [row]
        })
    }

}