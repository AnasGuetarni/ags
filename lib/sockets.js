// sockets.js

console.log('- sockets.js loaded'.yellow);

var dataAccess = require('./dataAccess');
var socketio = require('socket.io');
var express = require('express');
var session = require('express-session');
var functions = require('./functions');
var childProcess = require('child_process');

module.exports = function(http){
	var io = require("socket.io")(http);

	io.on('connection', function(socket) {

	socket.on('req_export_data', function(idQuestionnaire, idSession){
    	dataAccess.findExportData(idQuestionnaire, idSession, function(res){
    		socket.emit('res_export_data', res);
    	});
    });

  socket.on('req_exist_login', function(identifiant){
  	dataAccess.findByFieldHasValue('PROFESSEUR', 'IDENTIFIANT_PROFESSEUR', identifiant, function(res){
  		var loginExist;
  		if (res.length != 0) // AUCUNE LIGNE RENVOYEE, aucun professeur n'existe pour cet identifiant
  			loginExist = true;
  		else loginExist = false;
  		socket.emit('res_exist_login', loginExist);
  	});
  });
	});
}
