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
};