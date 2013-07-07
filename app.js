/**
 * Module dependencies.
 */
var express = require('express')
    , Site = require('./controllers/site').Site
    , ottd = require('./controllers/openttd').ServerController
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

//create a shared Model class available to all routes
var Models = require('./models/models.js').Models;
var modelsInstance = new Models();

//initialise an index controller for http stuff
var indexController = new Site(modelsInstance);
indexController.createRoutes('trains', app);

//initialise a server controller for management
var serverController = new ottd(modelsInstance);
serverController.createRoutes('trains', app);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});