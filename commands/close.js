const { Command } = require('../handlers/commandhandler');

module.exports = class CloseCommand extends Command {

    constructor(client) {
        super(client, 'close', 'Sluit een ticket');
        super.ticketCommand = true;

        const TicketToolsEvent = require('../events/ticketTools');
        this.tools = new TicketToolsEvent(this.client);
    }

    async execute(message, label, args) {
        this.tools.closeTicket(message);
    }

}