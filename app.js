global.PORT = 8080;

var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');
var helmet = require('helmet');
var colors = require('colors');

app.use(helmet());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

console.log("\nLoading custom modules:".yellow);
var db = require('./lib/db');
var dataAccess = require('./lib/dataAccess');
var routes = require('./lib/router')(app);
var functions = require('./lib/functions');
var io_route = require('./lib/sockets')(http);

app.get('/', function(req, res) {

    res.setHeader('Content-Type', 'text/plain');

    res.end('Vous etes a l\'accueil');

});

http.listen(global.PORT,function(){
    console.log(('\n' + "=== App Started on PORT " + global.PORT + " ===" + '\n').green);
});
