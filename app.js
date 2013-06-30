/**
 * Module dependencies.
 */
var os = 'Linux';
var lineEndings = '\n';

var express = require('express')
    , routes = require('./routes')
    , ottd = require('./routes/openttd')
    , http = require('http')
    , path = require('path');

var app = express();
app.set('env', 'production');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

//create OpenTTD process
var spawn = require('child_process').spawn, openttd;

if (os == 'Windows') {
    lineEndings = '\r\n';
    console.log('Spawning Windows OpenTTD Process');
    openttd = spawn('openttd.exe', ['-D'], {cwd: 'C:\\Program Files\\OpenTTD'});
} else {
    console.log('Spawning Linux OpenTTD Process');
    openttd = spawn('openttd', ['-D']);
}

//poll our controller
var interval = setInterval(function() {
    var toWrite = ottd.periodically()+'\r\n';
    openttd.stdin.write(toWrite);
}, 1000 * 60 * 2);

openttd.on('close', function (code) {
    console.log('OpenTTD exited with code ' + code);
    clearInterval(interval);
    process.exit(code);
});

//handle buffering stdout / stderr
var _buf = {out: '', error: ''};

//refactor this at some point
var buffer = function(stream, data) {
    if (data.indexOf(lineEndings) == -1) {
        _buf[stream] += data;
    } else {
        var line = _buf[stream] + data.replace(/(\r\n|\n|\r)/gm,"");
        ottd[stream](line);
        _buf[stream] = '';
    }
};

openttd.stdout.on('data', function(data) {
    buffer('out', data.toString());
});

openttd.stderr.on('data', function(data) {
    buffer('error', data.toString());
});