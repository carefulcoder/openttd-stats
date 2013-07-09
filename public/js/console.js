var socket = io.connect('http://localhost');

socket.on('err', function (data) {
  var line = document.createElement('span');
  line.appendChild(document.createTextNode(data.data + "\n"));
  line.className = 'error';
  document.getElementById('code').appendChild(line);
});
socket.on('out', function (data) {
    var line = document.createElement('span');
    line.appendChild(document.createTextNode(data.data + "\n"));
    line.className = 'out';
    document.getElementById('code').appendChild(line);
});