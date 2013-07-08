var socket = io.connect('http://localhost');
socket.on('err', function (data) {
  var line = document.createTextNode(data.data + "\n");
  document.getElementById('code').appendChild(line);
});
socket.on('out', function (data) {
    var line = document.createTextNode(data.data + "\n");
    document.getElementById('code').appendChild(line);
});