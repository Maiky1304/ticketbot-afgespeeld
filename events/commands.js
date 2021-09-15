const { Event } = require('../handlers/eventhandler');

module.exports = class CommandEvent extends Event {

    constructor(client) {
        super(client, 'messageCreate', 'on');
    }

    execute(message) {
        const content = message.content;

        if (!content.startsWith(this.client.config.prefix)) return;

        const label = content.slice(this.client.config.prefix.length).trim().split(' ')[0];
        const args = content.slice(this.client.config.prefix.length + label.length).trim().split(' ').filter(a => a);
        
        const command = this.client.commands.get(label);
        if (!command) return;

        if (command.permission && !message.member.permissions.has(command.permission)) {
            message.reply({
                content: 'Je hebt geen permissions om dit commando uit te voeren.',
                ephemeral: true
            });
            return;
        }

        command.execute(message, label, args);
    }

}