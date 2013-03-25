var server = require('./server/app.js').init();
var tests = require('./test.js').run_tests;

tests(function(){

	server.close();
	process.exit();

});