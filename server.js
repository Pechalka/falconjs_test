var path = require('path');
var http = require('http');
var express = require('express');
var app = express();
var makeREST = require('./makeREST');

app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);

makeREST(app, '/api/todo', [
	{ id : 1, title : '1111', completed : false },
	{ id : 2, title : '2222', completed : true },	
]);

app.use(express.static(path.join(__dirname, 'public')));

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});