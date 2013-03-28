var test = require('tap').test;
var post = require('./lib/post.js').post;

var Browser = require("zombie");

exports.run_tests = function(done){

	var tests = {
		'test1':false,
		'book_route_tests':false,
		'author_route_tests':false
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



	basic_test();

	create_author();
	// create, then read, then update, then read, then delete content
	create_book();


};


var basic_test = function() {
	test('check routes',function(t){
		browser.visit("http://localhost:3000/book/read", function () {

			var response = JSON.parse(browser.text());

			t.equals(response.success, true,'test if read route responds correctly');
			t.end();

			checkIfTestsDone('test1');
		});
	});
};



// create book test obj
var create_book = function(){
	test('test create book route',function(t){
		post('/book/create',
				{"obj":JSON.stringify({ "name": 'Testbook',"description": 'Testdescription'})},
				function (chunk) {
					var response = JSON.parse(chunk);
					var item_id = response.data._id;
					t.equals(response.success, true,'/book/create');
					t.end();

					// book_readAndCheckValue(item_id,'name','Testbook',update_book);
					update_book(item_id)
				});
	});
};

// update book test obj
var update_book = function(item_id){
	test('test update book route',function(t){
		post('/book/update',
			{"data":JSON.stringify([{ "_id":item_id, "name": 'blabla',"description": 'Testdescription'}])},
			function (chunk) {
				// var response = JSON.parse(chunk);
				console.log(chunk)
				t.end();
				book_readAndCheckValue(item_id,'name','blabla',false);
		});
	});
};

// read book
var book_readAndCheckValue = function(item_id,key,value,next){
	test('check values using "/read" '+value,function(t2){
		browser.visit("http://localhost:3000/book/read?_id="+item_id, function () {

			var response = JSON.parse(browser.text());
			console.log('gelesen')
			console.log(JSON.stringify(response.data))
			console.log(response.data[0][key] + value);
			t2.plan(1);
			t2.equals(response.data[0][key].toString(), value.toString(),'/book/read '+value.toString()+' '+response.data[0][key].toString());
			// t.equals('blabla', 'Testbook2','/author/create');
			t2.end();


			if(next === false){
				checkIfTestsDone('book_route_tests');
			}else{
				next(item_id);
			}
		});
	});
};

// create author test obj
var create_author = function(){
	test('test create author route',function(t){
		post('/author/create',
				{"obj":JSON.stringify({ "name": 'Testauthor',"description": 'Testdescription'})},
				function (chunk) {
					var response = JSON.parse(chunk);
					var item_id = response.data._id;
					t.equals(response.success, true,'/author/create');
					
					t.end();

					author_readAndCheckValue(item_id,'name','Testauthor',create_book_with_author);
				});
	});
};

// read author
var author_readAndCheckValue = function(item_id,key,value,next){
	test('/author/read',function(t){
		browser.visit("http://localhost:3000/author/read?_id="+item_id, function () {

			var response = JSON.parse(browser.text());

			t.equals(response.data[0][key], value,'/author/read');
			t.end();


			if(next === false){


			}else{
				next(item_id);
			}
		});
	});
};

// create book including author reference
var create_book_with_author = function(author_id){
	test('create book including author reference',function(t){
		post('/book/create',
				{"obj":JSON.stringify({ "name": 'Testbook',"description": 'Testdescription','author_id':[author_id]})},
				function (chunk) {
					var response = JSON.parse(chunk);
					var item_id = response.data._id;
					t.equals(response.success, true,'/book/create');
					t.end();

					book_readAndPopulateAuthor(item_id,'name','Testauthor',false);
				});
	});
};

// read book and populate author field
var book_readAndPopulateAuthor = function(item_id,key,value,next){
	test('check populated author_id field "book/read"',function(t){
		console.log("http://localhost:3000/book/read?_id="+item_id+"&populate[]=author_id");
		browser.visit("http://localhost:3000/book/read?_id="+item_id+"&populate[]=author_id", function () {

			var response = JSON.parse(browser.text());

			// console.log(response.data[0].author_id[0].name);
			t.equals(response.data[0].author_id[0][key], value,'check populated author_id /book/read');
			t.end();


			if(next === false){
				checkIfTestsDone('author_route_tests');
			}else{
				next(item_id);
			}
		});
	});
};