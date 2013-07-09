/**
 * Base Controller for our app
 */
define(function () {

    /**
     * Application controller
     */
    return function(app) {

        /**
         * Do something based on this page.
         */
        app.got('/trains/console', function(view) {

            //connect to the server via socket.io for console
            var socket = io.connect('http://localhost');

            socket.on('err', function (data) {
                view.write('error', data.data);
            });

            socket.on('out', function (data) {
                view.write('out', data.data);
            });
        });

        /**
         * Test controller route.
         */
        app.got('/trains/servers', function(view) {
            console.log('hello, world');
        });
    }
});