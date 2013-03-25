exports.register = function(dbhandler){


var authorSchema = new dbhandler.Schema({
  name				: String,
  description	: String,
  created			: {'type': Date, 'default': Date.now}
});


var author = dbhandler.db.model('Author', authorSchema);


app.dbhandlers.author = new dbhandler.init({
	path: '/author',
	crud:'crud',
	actions:{
		create:{},
		read:{
			parameters:[
				'author_id'
			]
		},
		update:{},
		destroy:{
			parameters:[
				'_id'
			]
		}
	},
	populate:[
		'user_id'
	],
	db:author
});

};