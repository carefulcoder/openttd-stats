/**
 * Construct a new Server model.
 * @constructor
 */
exports.Server = function()
{
    /**
     * Prototype buffer object
     * @type {{out: string, err: string}}
     */
    var buffer = {out: '', err: ''};

    /**
     * Lists of callbacks for each stream
     * @type {{out: Array, err: Array}}
     */
    var handlers = {out: [], err: []};

    /**
     * Map of server ID -> function
     * @type {{}}
     */
    var killHandlers = {};

    /**
     * List of server instances
     * @type {Array}
     */
    var instances = [];

    /**
     * List of buffers for each server.
     * @type {Array}
     */
    var buffers = [];

    /**
     * The current OS.
     * @type {string}
     */
    var os = 'Windows';

    /**
     * Get Line Endings
     * @returns {string}
     */
    var getLineEndings = function() {
        return os == 'Windows' ? '\r\n' : '\n';
    };

    /**
     * Helper function to buffer output from a process until a newline.
     * @param {number} id The id of our OTTD process
     * @param {string} stream Name of the stream
     * @param {string} data The data to buffer
     */
    var bufferData = function(id, stream, data) {
        if (data.indexOf(getLineEndings()) == -1) {
            buffers[id][stream] += data;
        } else {

            //get the complete line that we've buffered.
            var line = buffers[id][stream] + data.replace(/(\r\n|\n|\r)/gm,"");

            //execute handler function for output
            for (var handler in handlers[stream]) {
                if (handlers[stream].hasOwnProperty(handler)) {
                    handlers[stream][handler](id, line);
                }
            }

            //reset buffer contents
            buffers[id][stream] = '';
        }
    };

    /**
     * Spawn a new server
     * @param properties
     */
    this.spawnServer = function(properties) {

        var opts, proc,
            spawn = require('child_process').spawn;

        if (os == 'Windows') {
            opts = {cwd: 'C:\\Program Files\\OpenTTD'};
            proc = 'openttd.exe';
        } else {
            opts = {};
            proc = 'openttd';
        }

        //create a new buffer for our process
        buffers.push(Object.create(buffer));
        var bufferId = buffers.length - 1;

        //spin up a new OpenTTD server with OS options
        var instance = spawn(proc, ['-D'], opts);

        //buffer the output and input streams on a per line basis.
        instance.stdout.on('data', function(data) {
            bufferData(bufferId, 'out', data.toString());
        });

        instance.stderr.on('data', function(data) {
            bufferData(bufferId, 'err', data.toString());
        });

        instance.on('close', function (code) {
            console.log('OpenTTD instance exited with code ' + code);
            delete instances[bufferId];
            delete buffers[bufferId];

            //execute callback scheduled to run on kill
            if (typeof killHandlers[bufferId] == "function") {
                killHandlers[bufferId]();
                delete killHandlers[bufferId];
            }
        });

        //save our instance, return ID
        instances.push({server: instance, properties: properties});
        return instances.length - 1;
    };

    /**
     * Send a message to a particular running instance.
     * @param {number} id ID of a valid instance
     * @param {string} message a string message
     */
    this.sendMessage = function(id, message) {
        instances[id].server.stdin.write(message + getLineEndings());
    };

    /**
     * Add a handler to recieve messages from instances
     * @param {string} stream Name of the stream.
     * @param {function} handler Callback.
     */
    this.addHandler = function(stream, handler) {
        if (typeof handlers[stream] != 'undefined') {
            handlers[stream].push(handler);
        }
    };

    /**
     * Get all running server instance properties.
     * @return {object} non sequential IDs
     */
    this.getInstances = function()
    {
        var ret = {};
        for (var i = 0; i < instances.length; i++) {
            if (typeof instances[i] != 'undefined') {
                ret[i] = instances[i].properties;
            }
        }
        return ret;
    };

    /**
     * Kill a server
     * @param id
     */
    this.killServer = function(id, callback) {
        if (typeof instances[id] != 'undefined') {
            killHandlers[id] = callback;
            instances[id].server.kill();
        }
    };

    /**
     * Set our OS
     * @param arg
     */
    this.setOS = function(arg) {
        os = arg;
    }
};
