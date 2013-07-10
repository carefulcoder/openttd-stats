/**
 * Horrendous Clientside JS.
 */
(function($) {

    $(document).ready(function() {

        var socket = io.connect('http://localhost');

        //todo implement this
        var selected = window.location.hash;

        if (selected.length == 0) {
            selected = ':first';
        } else {
            selected = '#console' + tab;
        }

        $('#tabs a'+selected).tab('show'); // Select first tab

        //write something to the console
        var write = function(stream, data) {
            var line = document.createElement('span');
            line.appendChild(document.createTextNode(data.data + "\n"));
            line.className = stream;

            var c = document.getElementById('console'+data.id);
            c.appendChild(line);

            c.scrollTop = c.scrollHeight;

        };

        socket.on('err', function (data) {
            write('error', data);
        });

        socket.on('out', function (data) {
            write('out', data);
        });
    });

})(jQuery);
