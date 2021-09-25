const { Command } = require('../handlers/commandhandler');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = class AnnouncementCommand extends Command {

    constructor(client) {
        super(client, 'mededeling', 'Maak een mededeling', 'ADMINISTRATOR');
        this.sessions = {};
    }

    async execute(message, _label, _args) {
        const basic = new MessageEmbed();
        basic.setTitle('Titel');
        basic.setDescription('Beschrijving');

        const session = await message.channel.send({ embeds: [basic] });
        this.sessions[message.author.id] = session;

        const row = new MessageActionRow();

        const menu = new MessageSelectMenu();
        menu.setCustomId('announcement-options');
        menu.setPlaceholder('Kies een optie');
        menu.addOptions([
            {
                label: '📝 Verander titel',
                value: 'change_title'
            },
            {
                label: '📑 Verander tekst',
                value: 'change_description'
            },
            {
                label: '🖌️ Verander kleur',
                value: 'change_color'
            },
            {
                label: '➕ Nieuw veld',
                value: 'add_field'
            },
            {
                label: '➖ Verwijder veld',
                value: 'delete_field'
            },
            {
                label: '🔗 Verander URL',
                value: 'change_url'
            },
            {
                label: '📸 Verander thumbnail',
                value: 'change_thumbnail'
            },
            {
                label: '🕰️ Verander timestamp',
                value: 'change_timestamp'
            },
            {
                label: '▶️ Stuur bericht',
                value: 'send_message'
            },
            {
                label: '🔄 Reset',
                value: 'reset'
            },
            {
                label: '🗑️ Annuleren',
                value: 'cancel'
            }
        ])

        row.addComponents(menu);

        await session.edit({ components: [row] });

        const askQuestion = async (interaction, text, callback) => {
            const data = await interaction.channel.send({ embeds: [new MessageEmbed().setTitle(text).setColor(this.client.config.themecolor).setTimestamp()] });
            const filter = m => m.author.id === interaction.user.id;
            interaction.channel.awaitMessages({ filter, max: 1 }).then(async collected => {
                await data.delete();
                callback(collected.first());
            });
        };
        
        const collector = session.createMessageComponentCollector({ componentType: 'SELECT_MENU' });
        collector.on('collect', async btn => {
            if (btn.user.id !== message.author.id) {
                return;
            }

            if (btn.customId !== 'announcement-options') return;

            await btn.deferUpdate();

            const customId = btn.values[0];
            if (customId === 'change_title') {
                askQuestion(btn, 'Wat wil je als titel instellen?', async response => {
                    const sessionEmbed = session.embeds[0];
                    sessionEmbed.title = response.content;
                    try {
                        await session.edit({ embeds: [sessionEmbed] });
                    } catch(err) {
                        await btn.followUp({ content: err.message, ephemeral: true });
                    } finally {
                        await response.delete();
                    }
                });
            } else if (customId === 'change_description') {
                askQuestion(btn, 'Wat wil je als beschrijving instellen?', async response => {
                    const sessionEmbed = session.embeds[0];
                    sessionEmbed.description = response.content;
                    try {
                        await session.edit({ embeds: [sessionEmbed] });
                    } catch(err) {
                        await btn.followUp({ content: err.message, ephemeral: true });
                    } finally {
                        await response.delete();
                    }
                });
            } else if (customId === 'change_color') {
                askQuestion(btn, 'Wat wil je als kleur instellen?', async response => {
                    const sessionEmbed = session.embeds[0];
                    sessionEmbed.color = response.content;
                    try {
                        await session.edit({ embeds: [sessionEmbed] });
                    } catch(err) {
                        await btn.followUp({ content: err.message, ephemeral: true });
                    } finally {
                        await response.delete();
                    }
                });
            } else if (customId === 'add_field') { 
                const modal = {};
                const cache = [];

                askQuestion(btn, 'Naam van het veld?', async response => {
                    modal['name'] = response.content;
                    cache.push(response);
                    
                    askQuestion(btn, 'Waarde van het veld?', async response => {
                        modal['value'] = response.content;
                        cache.push(response);

                        askQuestion(btn, 'Inline? (ja/nee)', async response => {
                            modal['inline'] = response.content === 'ja';
                            cache.push(response);

                            const sessionEmbed = session.embeds[0];
                            if (!sessionEmbed.fields) {
                                sessionEmbed.fields = [];
                            }
                            sessionEmbed.fields.push(modal);
                            try {
                                await session.edit({ embeds: [sessionEmbed] });
                            } catch(err) {
                                await btn.followUp({ content: err.message, ephemeral: true });
                            } finally {
                                cache.forEach(async item => {
                                    try {
                                        await item.delete()
                                    } catch(err) {}
                                });
                            }
                        });
                    });
                });
            } else if (customId === 'delete_field') {
                if (!session.embeds[0].fields || session.embeds[0].fields.length === 0) {
                    await btn.followUp({ content: 'Er zijn geen velden!', ephemeral: true });
                    return;
                }

                askQuestion(btn, 'Welk veld wil je verwijderen? (1 - ' + session.embeds[0].fields.length + ')', async response => {
                    try {
                        const sessionEmbed = session.embeds[0];
                        delete sessionEmbed.fields[Number.parseInt(response.content) - 1];
                        await session.edit({ embeds: [sessionEmbed] });
                    } catch(err) {
                        await btn.followUp({ content: err.message, ephemeral: true });
                    } finally {
                        await response.delete(); 
                    }
                });
            } else if (customId === 'change_url') {
                askQuestion(btn, 'Geef de URL op?' + (session.embeds[0].url ? ' (of reset)': ''), async response => {
                    const sessionEmbed = session.embeds[0];
                    sessionEmbed.url = response.content === 'reset' ? undefined : response.content;
                    try {
                        await session.edit({ embeds: [sessionEmbed] });
                    } catch(err) {
                        await btn.followUp({ content: err.message, ephemeral: true });
                    } finally {
                        await response.delete();
                    }
                });
            } else if (customId === 'change_thumbnail') {
                askQuestion(btn, 'Geef de URL op?' + (session.embeds[0].thumbnail ? ' (of reset)': ''), async response => {
                    const sessionEmbed = session.embeds[0];
                    sessionEmbed.thumbnail = response.content === 'reset' ? undefined : response.content;
                    try {
                        await session.edit({ embeds: [sessionEmbed] });
                    } catch(err) {
                        await btn.followUp({ content: err.message, ephemeral: true });
                    } finally {
                        await response.delete();
                    }
                });
            } else if (customId === 'change_timestamp') {
                askQuestion(btn, 'Geef de tijd op?' + (session.embeds[0].thumbnail ? ' (of reset)': '') + ' (of nu)', async response => {
                    const sessionEmbed = session.embeds[0];
                    if (response.content === 'nu') {
                        sessionEmbed.setTimestamp();
                    } else {
                        sessionEmbed.thumbnail = response.content === 'reset' ? undefined : response.content;
                    }
                    try {
                        await session.edit({ embeds: [sessionEmbed] });
                    } catch(err) {
                        await btn.followUp({ content: err.message, ephemeral: true });
                    } finally {
                        await response.delete();
                    }
                });
            } else if (customId === 'change_author') {
                const modal = {};
                const cache = [];
                
                askQuestion(btn, 'Naam van de author?', async response => {
                    modal['name'] = response.content;
                    cache.push(response);

                    askQuestion(btn, 'URL voor icon? (of geen)', async response => {
                        modal['name'] = response.content === 'geen' ? undefined : response.content;
                        cache.push(response);

                        askQuestion(btn, 'URL voor author? (of geen)', async response => {
                            modal['name'] = response.content === 'geen' ? undefined : response.content;
                            cache.push(response);

                            const sessionEmbed = session.embeds[0];
                            sessionEmbed.author = modal;
                            try {
                                await session.edit({ embeds: [sessionEmbed] });
                            } catch(err) {
                                await btn.followUp({ content: err.message, ephemeral: true });
                            } finally {
                                cache.forEach(async item => await item.delete());
                            }
                        });
                    });
                });
            } else if (customId === 'send_message') {
                askQuestion(btn, 'In welk channel?', async response => {
                    const sessionEmbed = session.embeds[0];
                    try {
                        const channel = await response.guild.channels.fetch(response.content.slice(2, response.content.length - 1));
                        await channel.send({ embeds: [sessionEmbed] });
                    } catch(err) {
                        await btn.followUp({ content: err.message, ephemeral: true });
                    } finally {
                        await response.delete();
                        await session.delete();
        
                        delete this.sessions[btn.user.id];
                    }
                });
            } else if (customId === 'reset') {
                try {
                    const basic = new MessageEmbed();
                    basic.setTitle('Titel');
                    basic.setDescription('Beschrijving');
                    await session.edit({ embeds: [basic] });
                } catch(err) {
                    await btn.followUp({ content: err.message, ephemeral: true });
                }
            } else if (customId === 'cancel') {
                await session.delete();
                delete this.sessions[btn.user.id];
            }
        });
    }

}