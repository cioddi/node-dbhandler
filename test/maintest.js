var test = require('tap').test;

var Browser = require("zombie");

// Load the page from localhost
browser = new Browser()

browser.visit("http://localhost:3000/book/cleardb");

	test('Test 1: check routes',function(t){
		browser.visit("http://localhost:3000/book/read", function (arg1) {

			var response = JSON.parse(browser.text());

			t.equals(response.success, true,'test if read route responds correctly')
			t.end();
		});
	});



var querystring = require('querystring');
var http = require('http');

var post_domain = 'localhost';
var post_port = 3000;
var post_path = '/book/create';

var post_data = querystring.stringify({"obj":JSON.stringify({ "name": 'Testbuch',"description": 'Testdescription'})});
console.log(post_data);

var post_options = {
  host: post_domain,
  port: post_port,
  path: post_path,
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': post_data.length
  }
};
test('Test 1: content creation',function(t){
	var post_req = http.request(post_options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	  	var response = JSON.parse(chunk);
	  	console.log(chunk);
	  	
	  	test('Test 1: check routes',function(t2){
	  		console.log("http://localhost:3000/book/read");
				browser.visit("http://localhost:3000/book/read?_id="+response.data._id, function (arg1) {

					var response = JSON.parse(browser.text());
					console.log(browser.text());
					t2.equals(response.data[0].name, 'Testbuch','test if read route responds correctly')
					t2.end();
				});
			});
			t.equals(response.success, true,'test if create route responds correctly')
			t.end();
	  });
	});

	// write parameters to post body
	post_req.write(post_data);
	post_req.end();
});