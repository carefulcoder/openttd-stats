/**
 * Created with JetBrains PhpStorm.
 * User: Tom
 * Date: 09/07/13
 * Time: 21:14
 * To change this template use File | Settings | File Templates.
 */
exports.injector = function(app) {

    /**
     * Return our thing
     */
    return function(req, res, next) {
        app.set('action', req.url);
        next();
    }
};