const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const fs = require("fs");

const ticketsClosing = [],
  ticketsDelete = [];

module.exports.closeTicket = async (client, channel) => {
  const embed = new MessageEmbed();
  embed.setTitle("De ticket wordt over 10 seconden gesloten...");
  embed.setColor(client.config.themecolor);
  ticketsClosing.push(channel.id);
  setTimeout(async () => {
    if (ticketsClosing.includes(channel.id)) {
      const categoryData = require("../ticketcategories.json");
      const category = categoryData.find(
        (entry) => entry["category-id"] === channel.parent.id
      );
      if (!category) return;
      await channel.edit({
        permissionOverwrites: [
          {
            id: client.config["everyone-role-id"],
            deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
            type: "role",
          },
          {
            id: category["role-id"],
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
            type: "role",
          },
        ],
      });

      const embed = new MessageEmbed();
      embed.setTitle("De ticket is gesloten!");
      embed.setColor(client.config.themecolor);

      const closeOptions = new MessageActionRow();

      const deleteTicket = new MessageButton();
      deleteTicket.setLabel("Verwijder ticket");
      deleteTicket.setEmoji("🗑️");
      deleteTicket.setStyle("DANGER");
      deleteTicket.setCustomId("close-options-delete");

      const createTranscript = new MessageButton();
      createTranscript.setLabel("Maak transcript");
      createTranscript.setEmoji("🖨️");
      createTranscript.setStyle("PRIMARY");
      createTranscript.setCustomId("close-options-transcript");

      closeOptions.addComponents(deleteTicket, createTranscript);

      await channel.send({
        embeds: [embed],
        components: [closeOptions],
      });
    }
  }, 1000 * 10);
  return embed;
};

module.exports.cancelClose = (channel) => {
  const index = ticketsClosing.indexOf(channel.id);
  if (index > -1) {
    ticketsClosing.splice(index, index + 1);
  }
};

module.exports.deleteTicket = async (client, channel) => {
  const embed = new MessageEmbed();
  embed.setTitle("De ticket wordt over 10 seconden verwijderd...");
  embed.setColor(client.config.themecolor);
  ticketsDelete.push(channel.id);
  setTimeout(async () => {
    if (ticketsDelete.includes(channel.id)) {
      await channel.delete();
    }
  }, 1000 * 10);
  return embed;
};

module.exports.createTranscript = async (client, channel) => {
  let content = "";
  const messages = await channel.messages.fetch();
  messages.forEach((message) => {
    formatTags = (message) => {
      for (const word of message.split(" ")) {
        if (!word.startsWith("<@") && !word.endsWith(">")) continue;
        const replaceWith = `<p class="tag">${word}</p>`;
        message = message.replace(word, replaceWith);
      }
      return message;
    };
    html = `<div class="${message.embeds.length === 0 ? "message" : "embed"}">
      <h3><img src="${message.author.displayAvatarURL({
        dynamic: true,
      })}" alt="?"></img> ${message.author.username}#${
      message.author.discriminator
    }</h3>
      ${
        message.embeds.length === 0
          ? `<p>${formatTags(message.content)}</p>`
          : `<div="embed_box">
          <h4>${message.embeds[0].title}</h4>
          <p>${message.embeds[0].description}</p>
        </div>`
      }
    </div>
    
    <br>
    
    `;
    content += html;
  });
  content = content.slice(0, content.length - 8);

  let file = fs.readFileSync("templates/transcript.html", {
    encoding: "utf8",
  });
  const variables = {
    ticket_id: channel.name,
    theme_color: client.config.themecolor,
    channel_content: content,
  };

  for (let variable in variables) {
    variable = `{{${variable}}}`;
    while (file.includes(variable)) {
      file = file.replace(
        variable,
        variables[variable.slice(2, variable.length - 2)]
      );
    }
  }

  fs.writeFileSync(`transcripts/${channel.id}.html`, file, {
    encoding: "utf8",
  });
  return `transcripts/${channel.id}.html`;
};
