/**
 * Base View for our app
 */
define(function () {

    /**
     * View Constructor
     */
    return {
        route: '/trains/servers',
        constructor: function(document) {

            /**
             * Write a console line to the console
             * @param {string} stream The stream type (error, out)
             * @param {string} data The data to write.
             */
            this.write = function(stream, data) {
                var line = document.createElement('span');
                line.appendChild(document.createTextNode(data + "\n"));
                line.className = stream;
                document.getElementById('code').appendChild(line);
            };
        }
    }
});