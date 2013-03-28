exports = module.exports = new function(){
	// null password and salt entries bevore data delivery to client
	this.null_passwords = function(objs){
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

	this.getPopulateColumns = function(action,req){
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
};