const glob = require('glob-promise');

const {Collection} = require('discord.js');

module.exports.loadCommands = (client) => {
    client.commands = new Collection();

    glob('commands/**/*.js').then(results => {
        for (const moduleName of results) {
            const CommandClass = require(`../${moduleName}`);
            const command = new CommandClass(client);
            client.commands.set(command.label, command);
            console.log(`Registered ${command.label}`);
        }
    });
}

module.exports.Command = class Command {

    constructor(client, label, description, permission = undefined) {
        this.client = client;
        this.label = label;
        this.description = description;
        this.permission = permission;
    }

    execute(message, label, args) {
        console.log(`Executed command ${label}`);
    }

}