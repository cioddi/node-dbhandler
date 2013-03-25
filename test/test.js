var test = require('tap').test;
var post = require('./lib/post.js').post;

var Browser = require("zombie");

exports.run_tests = function(){
	// Load the page from localhost
	browser = new Browser()

	browser.visit("http://localhost:3000/book/cleardb");

	test('check routes',function(t){
		browser.visit("http://localhost:3000/book/read", function (arg1) {
			console.log(browser.text());
			var response = JSON.parse(browser.text());

			t.equals(response.success, true,'test if read route responds correctly')
			t.end();
		});
	});

	test('content creation',function(t){

		post('/book/create',
			{"obj":JSON.stringify({ "name": 'Testbuch',"description": 'Testdescription'})},
			function (chunk) {
					var response = JSON.parse(chunk);
					
					test('Test 1: check routes',function(t2){

					browser.visit("http://localhost:3000/book/read?_id="+response.data._id, function (arg1) {

						var response = JSON.parse(browser.text());
						t2.equals(response.data[0].name, 'Testbuch','test if read route responds correctly');
						t2.end();
					});
				});
				t.equals(response.success, true,'test if create route responds correctly');
				t.end();
		});
	});
};