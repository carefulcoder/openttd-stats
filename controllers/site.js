/**
 * Construct our Site controller
 * @param {object} models
 * @constructor
 */
exports.Site = function(models) {

    /**
     * Index Page
     * @param req
     * @param res
     */
    this.getIndex = function(req, res){
        models.Stat.all(function(results) {
            res.render('index', { results: JSON.stringify(results)});
        });
    };
};

var Controller = require('./controller').Controller;
exports.Site.prototype = new Controller();