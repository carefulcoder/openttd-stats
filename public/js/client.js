/*
 * Using slightly elderly DOM stuff
 * for IE < 9 (!) Support.
 */
window.onload = function() {

    //handlers for routes.
    var handlers = {};

    //views for routes.
    var views = {};

    /**
     * Basic MVC Dispatcher
     * @constructor
     */
    var app = {

        /**
         * Add a view to be passed to any controller responding to the given action
         * @param {string} route The route to set the view to be for
         * @param {function} view A View constructor
         */
        view: function(route, view) {
            views[route] = view;
        },

        /**
         * Register a callback to execute JS on the response of a given action
         * @param {string} action The action invoked by express
         * @param {function} handler The handler
         */
        got: function(action, handler) {
            if (typeof handlers[action] == 'undefined') {
                handlers[action] = [];
            }
            handlers[action].push(handler);
        },

        /**
         * Fire all callbacks assigned to an action
         * @param {string} action The action
         */
        fire: function(action) {
            if (typeof handlers[action] != 'undefined') {
                for (var i = 0; i < handlers[action].length; i++) {
                    var view = typeof views[action] == 'undefined' ? document : new views[action](document);
                    handlers[action][i](view);
                }
            }
        }
    };

    //load in views and controllers.
    //todo this needs to be parallel.
    require(['views/console'], function() {
        for (var i = 0; i < arguments.length; i++) {
            app.view(arguments[i].route, arguments[i].constructor);
        }

        //load in controllers to handle requests
        require(['controllers/console'], function() {
            for (var i = 0; i < arguments.length; i++) {
                arguments[i](app);
            }

            //run dispatcher
            app.fire(action);
        });
    });
};
