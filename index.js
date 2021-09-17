const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});
const fs = require("fs");
const { loadCommands } = require("./handlers/commandhandler");
const { loadEvents } = require("./handlers/eventhandler");

client.config = require("./config.json");
client.ticketUtils = require("./utils/ticketUtils");
client.embedUtils = require("./utils/embedUtils");

const mongoose = require("mongoose");
mongoose
  .connect(client.config.mongo)
  .then((_result) => console.log("Connected with MongoDB"))
  .catch((err) => console.error(err));

client.once("ready", () => {
  console.log(
    `Bot launched, logged in as ${client.user.username}#${client.user.discriminator}.`
  );

  console.log(`Loading commands...`);
  loadCommands(client);

  console.log(`Loading events...`);
  loadEvents(client);
});

client.login("ODY1NzYwMTI2Njk5MDQ0ODg1.YPIr8w.MTyNQpRCz6_i9tLYq7VL0NjvcSs");
