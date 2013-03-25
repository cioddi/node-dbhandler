var server = require('./server/app.js').init();
var tests = require('./test.js').run_tests;

// setTimeout(function(){server.close()},2000);
tests(function(){

	server.close();
	process.exit();
});