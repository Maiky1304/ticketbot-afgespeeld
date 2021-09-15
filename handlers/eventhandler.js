const glob = require('glob-promise');

module.exports.loadEvents = (client) => {
    glob('events/**/*.js').then(results => {
        for (const moduleName of results) {
            const EventClass = require(`../${moduleName}`);
            const event = new EventClass(client);
            client[event.type](event.name, (...args) => event.execute(...args));
            console.log(`Registered event ${event.name}`);
        }
    });
};

module.exports.Event = class Event {

    constructor(client, name, type) {
        this.client = client;
        this.name = name;
        this.type = type;
    }

}