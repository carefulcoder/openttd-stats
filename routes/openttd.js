var Stat = require('../models/stat.js').Stat;

/*
 * OpenTTD event logger - messages from stdout.
 */
exports.out = function(req) {

    //pick out valid responses to the "companies" command
    var pattern = /Company Name: '([^']+).*?Money: ([0-9]+)/;
    var patternResults = (pattern.exec(req));

    //save to a DB if valid. This is array check is the ugliest bit of JS I've ever seen.
    if (Object.prototype.toString.call( patternResults ) === '[object Array]' && patternResults.length > 0) {
        Stat.timestep++;
        var stat = new Stat();
        stat.companyName = patternResults[1];
        stat.companyMoney = patternResults[2];
        stat.save();
    }
};

/*
 * OpenTTD event logger - messages from stderr.
 */
exports.error = function(req){
    console.log('STDERR SAYS ' + req);
};

/*
 * Handle sending output every X seconds
 */
exports.periodically = function() {
    return 'companies';
};