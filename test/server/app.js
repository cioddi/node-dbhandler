var passport = require('passport');
var express = require('express');
var mongoose = require('mongoose');
var server;


exports.init = function(){
	var db = mongoose.createConnection('localhost', 'test_db');

	var dbhandler = require('../../');

	dbhandler.Schema = mongoose.Schema;
	dbhandler.db = db;

	// Create the database.
	app = express();
	app.use(express.bodyParser());

	app.db = db;
	app.dbhandlers = {};

	server = require('http').createServer(app);

	// model definitions
	var author = require('../model/author.js').register(dbhandler);
	var book = require('../model/book.js').register(dbhandler);

	server.listen(3000,function(){
		console.log('server started at port 3000');
	});
	return exports;
};

exports.close = function(){

	  server.close()
}