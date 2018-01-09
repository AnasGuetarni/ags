// db.js

console.log('- db.js loaded'.yellow);

var mysql= require('mysql');

var db = mysql.createConnection({
		    host     : 'localhost',
		    user     : 'root',
		    password : 'root',
		    database : 'bitmarketit',
		});


module.exports = db;
