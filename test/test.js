var test = require('tap').test;
var post = require('./lib/post.js').post;

var Browser = require("zombie");

exports.run_tests = function(done){

	var tests = {
		'test1':false,
		'test2':false
	};
	checkIfTestsDone = function(test_key){
		tests[test_key] = true;

		var allDone = true;
		for(var key in tests){
			if(tests[key] === false)allDone = false;
		}
		if(allDone)done();
	};
	// Load the page from localhost
	browser = new Browser();

	browser.visit("http://localhost:3000/book/cleardb");


	test('check routes',function(t){
		browser.visit("http://localhost:3000/book/read", function (arg1) {
			console.log(browser.text());
			var response = JSON.parse(browser.text());

			t.equals(response.success, true,'test if read route responds correctly');
			t.end();

			checkIfTestsDone('test1');
		});
	});

	// create, then read, then update, then read, then delete content
	test('content creation',function(t){

		post('/book/create',
			{"obj":JSON.stringify({ "name": 'Testbook',"description": 'Testdescription'})},
			function (chunk) {
					var response = JSON.parse(chunk);
					var item_id = response.data._id;



					browser.visit("http://localhost:3000/book/read?_id="+item_id, function (arg1) {

						var response = JSON.parse(browser.text());
						t.equals(response.data[0].name, 'Testbook','test if read route responds correctly');
						
						post('/book/update',
							{"obj":JSON.stringify({ "_id":item_id, "name": 'Testbook2',"description": 'Testdescription'})},
							function (chunk) {



								browser.visit("http://localhost:3000/book/read?_id="+item_id, function (arg1) {
									console.log('hallo ich bins');
									var response2 = JSON.parse(browser.text());

									t.equals(response2.data[0].name, 'Testbook2','test if read route responds correctly');

									checkIfTestsDone('test2');
									t.end();
								});

								t.equals(response.success, true,'test if create route responds correctly');
						});
					});

				t.equals(response.success, true,'test if create route responds correctly');
		});
	});
};