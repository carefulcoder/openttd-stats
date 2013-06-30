var Stat = require('../models/stat.js').Stat;
/*
 * GET home page.
 * This app has only one page.
 */
exports.index = function(req, res){
    Stat.all(function(results) {
        res.render('index', { results: JSON.stringify(results)});
    });
};