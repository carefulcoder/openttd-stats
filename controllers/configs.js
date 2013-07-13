/**
 * Construct our Site controller
 * @param {object} models
 * @constructor
 */
exports.Configs = function(models) {

    /**
     * Index Page
     * @param req
     * @param res
     */
    this.getIndex = function(req, res){
        models.Config.all(function(results) {
            res.render('configs', { configs: results});

            for (var i = 0; i < results.length; i++) {
                results[i].data.game_creation.map_x = 50000;
                //results[i].save();
            }

        });
    };
};

var Controller = require('./controller').Controller;
exports.Configs.prototype = new Controller();