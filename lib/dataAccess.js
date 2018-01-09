// dataAccess.js

console.log('- dataAccess.js loaded'.yellow);

var mysql= require('mysql');
var db = require('./db');

module.exports = {

	findAll: function(table, callback){
		var list = new Array();
		var queryString = 'SELECT * FROM ' + table;
		db.query(queryString, function(err,rows){
			if(err) throw err;
			for(var i in rows)
			{
				list.push(rows[i]);
			}
			callback(list);
		});
	},

	del: function(table, field, value, callback){
		var queryString = "DELETE FROM " + table + " WHERE " + field + "=?";
		db.query(queryString, [value], function(err,rows){
			if(err) throw err;
			callback();
		});
	},

}
