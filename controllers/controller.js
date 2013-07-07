/**
 * Controller Prototype.
 * @constructor
 */
exports.Controller = function() {

    /**
     * Bind routes to our Express instance
     * @param prefix Prefix for these routes.
     * @param {object} app
     */
    this.createRoutes = function(prefix, app) {

        for (var route in this) {
            if (this.hasOwnProperty(route) && this[route] instanceof Function) {
                if (route.indexOf('post') === 0) { //post routes are prefixed with post...
                    app.post('/'+prefix+'/'+route.substr(4).toLowerCase(), this[route]);
                } else if (route.indexOf('get') === 0) { //...while get routes begin with get.
                    app.get('/'+prefix+'/'+route.substr(3).toLowerCase(), this[route]);
                    console.log('Adding get route ' +prefix+'/'+route.substr(3).toLowerCase());
                }
            }
        }
    }
};