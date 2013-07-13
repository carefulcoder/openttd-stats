/**
 * Module dependencies.
 */
var express = require('express')
    , Site = require('./controllers/site').Site
    , Configs = require('./controllers/configs').Configs
    , Server = require('./controllers/openttd').ServerController
    , injector = require('./middleware/injector').injector
    , http = require('http')
    , path = require('path');

var app = express();
//we make a socket IO instance available
//solely for writing server console logs.
//structure may need to be changed for non broadcast messages
var sktio = require('socket.io');

//URI, available to views.
app.set('uri', '/');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());

app.use(express.bodyParser());
app.use(express.methodOverride());

//cookie + session middleware
app.use(express.cookieParser());
app.use(express.session({secret: '!!!CHANGEME!!!'})); //no, really. I mean it.

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//create a shared Model class available to all routes
var Models = require('./models/models.js').Models;
var modelsInstance = new Models();

//initialise an index controller for http stuff
var indexController = new Site(modelsInstance);
indexController.createRoutes('trains', app);

//initialise a server controller for management
var serverController = new Server(modelsInstance);
serverController.createRoutes('trains', app);

//initialise a config controller for ottd config files
var configController = new Configs(modelsInstance);
configController.createRoutes('config', app);

var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
    modelsInstance.io = sktio.listen(server);
});