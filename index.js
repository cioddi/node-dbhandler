// tobi

var Query = require('./lib/query.js').Query;
var lib = require('./lib/lib.js');
var debug = require('./lib/debug.js');
var access_control = require('./lib/access_control.js');
var history_module = require('./lib/history.js');

exports.register_create = function(options){
	app.post(options.path+'/create',function(req,res){
		req.options = options;
		var action = 'create';
		//console.log('create this');
		//console.log(req.body.obj);

		var obj = req.param('obj', null);

		obj = JSON.parse(obj);
		if(typeof obj._id !== 'undefined'){
			delete obj._id;
		}


		history_module.create_history(req,obj);
		obj = new options.db(obj);
		obj.save(function(err, saved) {

			// run 'after' function
			if(typeof req.options.actions[action].after !== undefined){
				for(var i in req.options.actions[action].after){
					if(typeof req.options.actions[action].after[i] === 'function' &&
						req.options.actions[action].after.hasOwnProperty(i))req.options.actions[action].after[i](req);
				}
			}
			res.send(JSON.stringify({success:true,data:{_id:saved._id}}));
		});
	});
};

exports.getPopulateColumns = function(action,req){
	var returnList = [];

	if(typeof req.body !== 'undefined'){
		if(typeof req.body.populate !== 'undefined'){
			var populateList = req.body.populate;
			// //console.log(req.options.actions[action]);
			for(var key in populateList){
				if(typeof req.options.actions[action].populate !== 'undefined'){
					if(typeof req.options.actions[action].populate[key] !== 'undefined')returnList.push(populateList[key]);
				}
				
			}
		}
	}

	if(typeof req.query !== 'undefined'){
		if(typeof req.query.populate !== 'undefined'){
			var populateList = req.query.populate;

			for (var i = 0; i < populateList.length; i++) {
				
				if(typeof req.options.actions[action].populate !== 'undefined'){
					// console.log(req.options.actions[action].populate);
					returnList.push(populateList[i]);
				}
			};
			// for(var key in populateList){
			// 	if(typeof req.options.actions[action].populate !== 'undefined'){
			// 		console.log(req.options.actions[action].populate);
			// 		if(typeof req.options.actions[action].populate[key] !== 'undefined')returnList.push(populateList[key]);
			// 	}

			// }
		}
	}

	return returnList;
};

exports.register_read = function(options){

	app.get(options.path+'/read',function(req,res){
		var action = 'read';
		req.options = options;
		// //console.log(req.query);
		// //console.log('asd');

		var query = new Query(action,req);
		

		dbquery = options.db.find( query.build() );

		populateColumns = exports.getPopulateColumns(action,req);
// console.log(populateColumns)
		for(var i in populateColumns){
			dbquery.populate(populateColumns[i]);
		}


		if(typeof options.actions['read'].sort !== 'undefined'){
			dbquery.sort(options.sort);
		}

		dbquery.exec(function(err, result ){
			if (err || !result ) console.log(" an error has occurred" );
			else {

				lib.null_passwords(result);

				var returnObj = {
						success:true,
						data:result
					};

				res.send(JSON.stringify(returnObj));
			}
		});
	});
};



exports.register_update = function(options){

	app.post(options.path+'/update',function(req,res){
		var action = 'update';
		req.options = options;

		var obj = JSON.parse(req.body.obj);

		//console.log(obj)

		var query = new Query(action,req);

		query.add({ _id : obj._id });

		var dbquery = query.build();


		history_module.create_history(req,obj);


		delete obj.user_id;
		delete obj._id;
		//console.log(obj)
		// var updateObj = options.db(obj);
		options.db.findOneAndUpdate(dbquery,obj, function(err, saved) {
			//console.log(err);

			res.send('{success:true}');
		});
	});
};

exports.register_destroy = function(options){

	app.post(options.path+'/destroy',function(req,res){

		var action = 'destroy';
		req.options = options;
		if(typeof req.body._id !== 'undefined'){

			var query = new Query(action,req);

			var dbquery = query.build();


			if(JSON.stringify(dbquery) !== '{}' && typeof dbquery._id !== 'undefined'){

				options.db.remove( dbquery, function(err, result ){
					if (err || !result )res.send(JSON.stringify('{success:false,msg:"an error occurred"}'));
					else {
						//console.log(req.options.actions[action].after);
						for(var i in req.options.actions[action].after){
							if(typeof req.options.actions[action].after[i] === 'function' &&
								req.options.actions[action].after.hasOwnProperty(i))req.options.actions[action].after[i](req);
						}
						res.send(JSON.stringify('{success:true}'));
					}
				});
			}
		}
		res.send(JSON.stringify('{success:false,msg:"_id missing"}'));
		
	});
};

exports.init = function(options){

	var self = this;

	if(typeof options.actions.create !== 'undefined')exports.register_create(options);

	if(typeof options.actions.read !== 'undefined')exports.register_read(options);

	if(typeof options.actions.update !== 'undefined')exports.register_update(options);

	if(typeof options.actions.destroy !== 'undefined')exports.register_destroy(options);

	if(typeof options.debug !== 'undefined')require('./lib/debug.js').debug_mode(options);

	return self;
};