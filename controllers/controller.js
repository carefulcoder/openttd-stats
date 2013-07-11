/**
 * Controller Prototype.
 * @constructor
 */
exports.Controller = function() {

    /**
     * Terrible solution for function GET arguments.
     * Suffice to say this isn't good.
     * @type {{}}
     */
    this.args = {};

    /**
     * Base URI of this controller
     * @type {string}
     */
    this.uri = '';

    /**
     * Bind routes to our Express instance
     * @param prefix Prefix for these routes.
     * @param {object} app
     */
    this.createRoutes = function(prefix, app) {

        //set the URI of the controller.
        this.uri = app.get('uri') + prefix + '/';

        for (var route in this) {
            if (this.hasOwnProperty(route) && this[route] instanceof Function) {

                if (route.indexOf('post') === 0) { //post routes are prefixed with post...
                    app.post('/'+prefix+'/'+route.substr(4).toLowerCase(), this[route].bind(this));
                } else if (route.indexOf('get') === 0) { //...while get routes begin with get.

                    //build up get args.
                    var argumentString = '';
                    if (typeof this.args[route] != 'undefined' && this.args[route].length > 0) {
                        for (var i = 0; i < this.args[route].length; i++) {
                            argumentString += '/:' + this.args[route][i]+'?';
                        }
                    }

                    app.get('/'+prefix+'/'+route.substr(3).toLowerCase() + argumentString, this[route].bind(this));
                    console.log('Adding get route ' +prefix+'/'+route.substr(3).toLowerCase());
                }
            }
        }
    }
};