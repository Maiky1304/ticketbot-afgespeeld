const { Command } = require("../handlers/commandhandler");

module.exports = class TicketAddCommand extends Command {
  constructor(client) {
    super(client, "add", "Add een member aan een ticket");
    super.ticketCommand = true;
  }

  execute(message, label, args) {
    message.reply({ content: "Hallo" });
  }
};
