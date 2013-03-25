exports.register = function(dbhandler){

	
var bookSchema = new dbhandler.Schema({
  name				: String,
  description	: String,
  author_id		: [{ 'type': dbhandler.Schema.Types.ObjectId, 'ref': 'recipes' }],
  created			: {'type': Date, 'default': Date.now}
});


var book = dbhandler.db.model('Book', bookSchema);


app.dbhandlers.book = new dbhandler.init({
	path: '/book',
	crud:'crud',
	actions:{
		create:{},
		read:{
			parameters:[
				'author_id',
				'_id'
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
	db:book
});

}