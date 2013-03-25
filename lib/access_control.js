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