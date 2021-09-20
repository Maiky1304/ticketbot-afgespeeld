const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    channelId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    ticketCreator: {
        type: String,
        required: true
    },
    open: {
        type: Boolean,
        required: true
    }
});

schema.statics.isOpen = async (channel) => {
    const ticket = mongoose.model('tickets').findOne({ channelId: channel });
    if (!ticket) return false;
    return ticket.open;
};

module.exports = mongoose.model('tickets', schema);