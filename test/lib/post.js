var querystring = require('querystring');
var http = require('http');

exports.post = function(url,params,done){


	var post_domain = 'localhost';
	var post_port = 3000;
	var post_path = '/book/create';

	var post_data = querystring.stringify(params);

	var post_options = {
	  host: post_domain,
	  port: post_port,
	  path: url,
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/x-www-form-urlencoded',
	    'Content-Length': post_data.length
	  }
	};

	var post_req = http.request(post_options, function(res) {

		res.setEncoding('utf8');
		res.on('data', done);
	});
	// write parameters to post body
	post_req.write(post_data);
	post_req.end();
};