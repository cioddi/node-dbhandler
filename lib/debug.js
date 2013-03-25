exports.debug_mode = function(options){
	app.post(options.path+'/listbyuser',function(req,res){
		options.db.find({user_id:req.body.user_id}).populate('user_id').exec(function(err,result){
			if(err)res.send(JSON.stringify({success:false}));
			res.send(JSON.stringify({success:true,data:result}));
		});
	});

	app.get(options.path+'/cleardb',function(req,res){
		options.db.remove({},function(){
			res.send('leer');
		});
	});
};