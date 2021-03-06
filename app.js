
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function (req, res) {
    res.sendfile('views/rx.html');
});
app.get('/test', function (req, res) {
    res.sendfile('views/index.html');
});
app.get('/test/m', function (req, res) {
    res.sendfile('views/rx.html');
});
app.get('/ajax', function (req, res) {
    console.log('getok');
    res.send({'status' : 'ok'});
});
app.post('/ajax', express.bodyParser(), function (req, res) {

    console.log(req.body, req.body.data);
    res.send({'status' : 'postok'});
});
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
