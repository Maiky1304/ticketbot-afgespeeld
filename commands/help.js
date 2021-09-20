const { Command } = require('../handlers/commandhandler');

const { MessageEmbed } = require('discord.js');
const builders = require('@discordjs/builders')

module.exports = class TestCommand extends Command {

    constructor(client) {
        super(client, 'help', undefined);
    }

    async execute(message, _label, _args) {
        const commands = this.client.commands;

        const embed = new MessageEmbed();
        embed.setTitle('Ticket Bot - Help Menu');
        let description = '';
        Array.from(commands.values()).forEach(key => {
            if (key.permission && !message.member.permissions.has(key.permission)) return;
            const line = builders.inlineCode(`${this.client.config.prefix}${key.label}`) + ` **|** ${key.description ? key.description : 'Geen beschrijving'}\n`;
            description += line;
        });
        embed.setDescription(description.slice(0, description.length - 1));
        embed.setFooter('Opgehaald op');
        embed.setTimestamp();
        embed.setColor(this.client.config.themecolor);

        await message.reply({ embeds: [embed] });
    }

}