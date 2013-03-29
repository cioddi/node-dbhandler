var Query = require('./lib/query.js').Query;
var lib = require('./lib/lib.js');
var debug = require('./lib/debug.js');
var access_control = require('./lib/access_control.js');
var history_module = require('./lib/history.js');

// 'create' route
exports.register_create = function(options){
	app.post(options.path+'/create',function(req,res){
		req.options = options;
		var action = 'create';

		var obj = req.param('obj', '{}');

		obj = JSON.parse(obj);
		if(typeof obj._id !== 'undefined'){
			delete obj._id;
		}


		history_module.create_history(req,obj);

		obj = new options.db(obj);

		obj.save(function(err, saved) {

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

// 'read' route
exports.register_read = function(options){

	app.get(options.path+'/read',function(req,res){
		var action = 'read';
		req.options = options;

		var query = new Query(action,req);

		var skip = parseInt(req.param('start', 0));
		var limit = parseInt(req.param('limit', 0));

		dbquery = options.db.find( query.build(),null,{ skip: skip, limit: limit } );
		console.log(req.param('start', 0));
		populateColumns = lib.getPopulateColumns(action,req);

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

				console.log(result.length)
				var returnObj = {
						success:true,
						data:result
					};
				options.db.count(query.build(), function(err, result){

					returnObj.count = result;
					res.send(JSON.stringify(returnObj));
				});
				
			}
		});
	});
};

exports.getUpdateFunction = function(obj,req,options){
	return function(done){

		var query = new Query('update',req);

		query.add({ _id : obj._id });

		var dbquery = query.build();

		history_module.create_history(req,obj);

		delete obj.user_id;
		delete obj._id;

		options.db.findOneAndUpdate(dbquery,obj, function(err, saved) {
			done();
		});
	};
};
// 'update' route
exports.register_update = function(options){

	app.post(options.path+'/update',function(req,res){
		var action = 'update';
		req.options = options;
		var callback_array = [];

		var objs = JSON.parse(req.body.data);

		for (var i = 0; i < objs.length; i++) {

			if(typeof objs[i] !== 'undefined'){
				var updateFunc = exports.getUpdateFunction(objs[i],req,options);
				callback_array.push(updateFunc);
			}
		}

		var doneFunc = function(){
			res.send('{success:true}');
		};

		callback_array.push(doneFunc);

		exports.callAsync(callback_array);
	});
};



exports.callAsync = function(callback_array){

	if(callback_array.length > 1){
		var func = callback_array[0];
		callback_array.splice(0,1);

		func(function(){ exports.callAsync(callback_array);});
	}else{
		callback_array[0]();
	}
};

// 'destroy' route
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

exports.register_config = function(options) {
  app.get(options.path+'/config',function(req,res){


			res.send(JSON.stringify({success:true,data:options.schema}));

	});
};

    
// init
exports.init = function(options){

	var self = this;

	if(typeof options.actions.create !== 'undefined')exports.register_create(options);

	if(typeof options.actions.read !== 'undefined')exports.register_read(options);

	if(typeof options.actions.update !== 'undefined')exports.register_update(options);

	if(typeof options.actions.destroy !== 'undefined')exports.register_destroy(options);

	if(typeof options.actions.config !== 'undefined')exports.register_config(options);

	if(typeof options.debug !== 'undefined')require('./lib/debug.js').debug_mode(options);

	return self;
};