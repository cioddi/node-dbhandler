var test = require('tap').test;


var Browser = require("zombie");
// var assert = require("assert");

// console.log('123')
// Load the page from localhost
browser = new Browser()
// browser.visit("http://localhost:3000/book/read", function (arg1) {


	// console.log(arg1);
      // // Form submitted, new page loaded.
      // assert.ok(browser.success);
      // assert.equal(browser.text("title"), "Welcome To Brains Depot");
	test('Test 1',function(t){
		browser.visit("http://localhost:3000/book/read", function (arg1) {
			// console.log(browser.text())

			// t.plan(1)
			t.equals(browser.text(), '{"success":true,"data":[]}','test if read route was created')
			t.end();
		});
	});
// });


