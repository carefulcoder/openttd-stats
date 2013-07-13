var iniparser = require('iniparser'),
    configDir = 'configs/';
    fs = require('fs');
/**
 * A basic config file model.
 * @constructor
 */
exports.Config = function(filename, data) {

    this.data = iniparser.parseString(data.toString());

    /**
     * Get the file name of our config file
     * @returns {string}
     */
    this.getName = function() {
        return filename;
    };

    /**
     * Get a string representation of our config file
     * @returns {string}
     */
    this.toString = function() {
        return iniparser.stringify(this.data);
    };

    /**
     * Write the data held by this config file
     * back to its source in ini format.
     */
    this.save = function(newFilename) {

        var returnNew = false;

        //optional new filename to write to
        if (typeof newFilename == 'undefined') {
            newFilename = filename;
            returnNew = true;
        }

        //do the write asynchronously so we don't hog the event loop
        fs.writeFile(configDir+newFilename, this.toString(), function() {
            console.log('done writing');
        });

        //if they're writing to a new filename return a new object representing the new file
        return returnNew ? new exports.Config(newFilename, this.toString()) : this;
    }
};

/**
 * Fetch all config files parsed into Config objects, above.
 * @param callback Callback to run when all files retrieved.
 */
exports.Config.all = function(callback) {

    console.log(process.cwd());
    fs.readdir('configs', function(err, files) {
        for (var i = 0; i < files.length; i++) {

            var ret = [];
            (function(i) {
                fs.readFile(configDir+files[i], function(err, data) {
                    ret.push(new exports.Config(files[i], data));
                    if (ret.length == files.length) {
                        callback(ret);
                    }
                });
            })(i);
        }
    });
};