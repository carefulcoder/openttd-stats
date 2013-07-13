/**
 * Container type thing for Model classes.
 * @constructor
 */
exports.Models = function() {

    //initialise MySQL connection
    var connection = require('mysql').createConnection({
        host: 'localhost',
        user: 'root',
        password: ''
    });

    //use our OpenTTD Database
    connection.query('USE openttd');

    /**
     * Statistics Model
     * @type {object}
     */
    this.Stat = require('./stat.js').Stat;
    this.Stat.connection = connection;

    //grab a defenition of our server object
    var Server = require('./server.js').Server;

    /**
     * Server Model. Singleton (ish)
     * @type {object}
     */
    this.servers = new Server();

    /**
     * Config file model
     * @type {object}
     */
    this.Config = require('./config.js').Config;
};