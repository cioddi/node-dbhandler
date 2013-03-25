var passport = require('passport');
var express = require('express');
var mongoose = require('mongoose');

var db = mongoose.createConnection('localhost', 'test_db');

var dbhandler = require('../../');

dbhandler.Schema = mongoose.Schema;
dbhandler.db = db;

// Create the database.
app = express();

app.db = db;
app.dbhandlers = {};

// model definitions
var author = require('../model/author.js').register(dbhandler);
var book = require('../model/book.js').register(dbhandler);

app.listen(3000);
console.log('hallp')