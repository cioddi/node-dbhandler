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
		if(typeof this.req.query !== 'undefined'){
			
			if(typeof this.req.options.actions[this.action] !== 'undefined'){
				for(var key in this.req.options.actions[this.action].parameters){

					var keystring = this.req.options.actions[this.action].parameters[key];
					if(typeof this.req.query[keystring] !== 'undefined' &&
						key !== 'populate')this.query[keystring] = this.req.query[keystring];

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