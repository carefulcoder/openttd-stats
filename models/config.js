var iniparser = require('iniparser');

/**
 * A basic config file model.
 * @constructor
 */
exports.Config = function(filename, data) {

    var keyValues = iniparser.parseString(data.toString());
    console.log(keyValues);

    this.getData = function() {
        return keyValues;
    };

    this.getName = function() {
        return filename;
    }
};

exports.Config.all = function(callback) {
    fs = require('fs');
    console.log(process.cwd());
    fs.readdir('configs', function(err, files) {
        for (var i = 0; i < files.length; i++) {

            var ret = [];
            (function(i) {
                fs.readFile('configs/'+files[i], function(err, data) {
                    ret.push(new exports.Config(files[i], data));
                    if (ret.length == files.length) {
                        callback(ret);
                    }
                });
            })(i);
        }
    });
};