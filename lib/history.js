exports.create_history = function(req,obj){
	if(typeof req.options.history !== 'undefined'){

		obj.reference = obj._id;
		delete obj._id;
		delete obj.created;
		var history_obj = new req.options.history(obj);
		history_obj.save();
	}

};