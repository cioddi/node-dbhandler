// tobi
exports = module.exports = function(){


	
};
exports.create_history = function(req,obj){
	if(typeof req.options.history !== 'undefined'){

		obj.reference = obj._id;
		delete obj._id;
		delete obj.created;
		var history_obj = new req.options.history(obj);
		history_obj.save();
	}

};

exports.read_history = function(){

};

// null password and salt entries bevore data delivery to client
exports.null_passwords = function(objs){
	for(var i in objs){
			if(typeof objs[i].password !== 'undefined'){

				objs[i].password = null;
			}
			if(typeof objs[i].salt !== 'undefined'){

				objs[i].salt = null;
			}
		if(typeof objs[i].user_id !== 'undefined' && objs[i].user_id !== null ){
			if(typeof objs[i].user_id.password !== 'undefined'){

				objs[i].user_id.password = null;
			}
			if(typeof objs[i].user_id.salt !== 'undefined'){

				objs[i].user_id.salt = null;
			}
		}
	}
};

exports.register_create = function(options){
	app.post(options.path+'/create',function(req,res){
		req.options = options;
		var action = 'create';

		var obj = JSON.parse(req.body.obj);

		if(typeof obj._id !== 'undefined'){
			delete obj._id;
		}


		exports.create_history(req,obj);
		obj = new options.db(obj);
		obj.save(function(err, saved) {

			// run 'after' function
			if(typeof req.options.actions[action].after !== undefined){
				console.log('hier');
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
	console.log(req.body);
	if(typeof req.body !== 'undefined'){
		if(typeof req.body.populate !== 'undefined'){
			var populateList = req.body.populate;
			// console.log(req.options.actions[action]);
			for(var key in populateList){
				if(typeof typeof req.options.actions[action].populate !== undefined){
					if(typeof req.options.actions[action].populate[key] !== 'undefined')returnList.push(populateList[key]);
				}
				
			}
		}
	}
	return returnList;
};

exports.register_read = function(options){

	app.post(options.path+'/read',function(req,res){
		var action = 'read';
		req.options = options;

		var query = new exports.Query(action,req);
		

		dbquery = options.db.find( query.build() );

		populateColumns = exports.getPopulateColumns(action,req);

		for(var i in populateColumns){
			dbquery.populate(populateColumns[i]);
		}


		if(typeof options.actions['read'].sort !== 'undefined'){
			dbquery.sort(options.sort);
		}

		dbquery.exec(function(err, result ){
			if (err || !result ) console.log(" an error has occurred" );
			else {

				exports.null_passwords(result);

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
		

		var query = new exports.Query(action,req);

		query.add({ _id : obj._id });

		var dbquery = query.build();


		exports.create_history(req,obj);


		delete obj.user_id;
		delete obj._id;
		// var updateObj = options.db(obj);
		options.db.findOneAndUpdate(dbquery,obj, function(err, saved) {
			console.log(err);

			res.send('{success:true}');
		});
	});
};

exports.register_destroy = function(options){

	app.post(options.path+'/destroy',function(req,res){

		var action = 'destroy';
		req.options = options;
		if(typeof req.body._id !== 'undefined'){

			var query = new exports.Query(action,req);

			var dbquery = query.build();

console.log(dbquery);
			if(JSON.stringify(dbquery) !== '{}' && typeof dbquery._id !== 'undefined'){

				options.db.remove( dbquery, function(err, result ){
					if (err || !result )res.send(JSON.stringify('{success:false,msg:"an error occurred"}'));
					else {
						console.log(req.options.actions[action].after);
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

exports.accessAllowed = function(req,res,done){
	var access = true;
	if(typeof req.options.actions[action] !== 'undefined'){
		if(typeof req.options.actions[action].allow !== 'undefined'){
			switch(req.options.actions[action].allow){
				case 'user':
					if(typeof req._passport.session.user === 'undefined')access = false;
					break;
			}
		}
	}


	if(access){
		done(msg,access);
	}else res.send(JSON.stringify({success:false,msg:'access denied'}));
};

exports.init = function(options){

	var self = this;

	if(typeof options.actions.create !== 'undefined')exports.register_create(options);

	if(typeof options.actions.read !== 'undefined')exports.register_read(options);

	if(typeof options.actions.update !== 'undefined')exports.register_update(options);

	if(typeof options.actions.destroy !== 'undefined')exports.register_destroy(options);


	self.read = function(query,done){
			var action = 'read';
			var req = {};
			req.options = options;
			req.body = query;

			query = new exports.Query(action,req);
			
			dbquery = options.db.find( query.build() );
			
			populateColumns = exports.getPopulateColumns(action,req);
			console.log(db);
			for(var i in populateColumns){
				dbquery.populate(populateColumns[i]);
			}

			if(typeof options.actions['read'].sort !== 'undefined'){
				dbquery.sort(options.sort);
			}
			console.log(dbquery);
			dbquery.exec(function(err, result ){
				console.log(result);
					done(err,result);
			});
	};



	app.post(options.path+'/listbyuser',function(req,res){
		options.db.find({user_id:req.body.user_id}).populate('user_id').exec(function(err,result){
			if(err)res.send(JSON.stringify({success:false}));
			res.send(JSON.stringify({success:true,data:result}));
		});
	});

	app.get(options.path+'/cleardb',function(req,res){
		Options.db.remove({},function(){
			res.send('leer');
		});
	});

	app.get(options.path+'/read',function(req,res){
		options.db.find({},function(err,result){
			if(err)res.send(JSON.stringify({success:false}));
			res.send(JSON.stringify({success:true,data:result}));
		});
	});

	return self;
};

exports.Query = function(action,req){
	

	this.init = function(action,req){
		this.action = action;
		this.req = req;
		this.query = {};
	};

	this.add = function(condition){
		for(var key in condition){
			if(condition.hasOwnProperty(key)){
				this.query[key] = condition[key];
			}
		}
	};

	this.insertParameters = function(){

		if(typeof this.req.body !== 'undefined'){

			if(typeof this.req.options.actions[this.action] !== 'undefined'){
				for(var key in this.req.options.actions[this.action].parameters){

					var keystring = this.req.options.actions[this.action].parameters[key];
					if(typeof this.req.body[keystring] !== 'undefined' &&
						key !== 'populate')this.query[keystring] = this.req.body[keystring];

				}
			}

		}
	};

	this.insertForcedQueries = function(){
		if(typeof this.req.options.actions[this.action] !== 'undefined'){
			if(typeof this.req.options.actions[this.action].query !== 'undefined'){
				for (var key in this.req.options.actions[this.action].query){
					if(key === 'user_id' && this.req.options.actions[this.action].query[key] === 'session'){
						this.query.user_id = this.req._passport.session.user;
					}else{
						this.query[key] = this.req.options.actions[this.action].query[key];
					}
				}
			}
		}
	};

	this.build = function(){
		this.insertParameters();
		this.insertForcedQueries();
		return this.query;
	};

	this.init(action,req);
};

