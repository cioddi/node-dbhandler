exports.register = function(dbhandler){

	
var bookSchema = new dbhandler.Schema({
  name				: String,
  description	: String,
  author_id		: [{ 'type': dbhandler.Schema.Types.ObjectId, 'ref': 'Author' }],
  created			: {'type': Date, 'default': Date.now}
});


var book = dbhandler.db.model('Book', bookSchema);


app.dbhandlers.book = new dbhandler.init({
	path: '/book',
	actions:{
		create:{},
		read:{
			parameters:[
				'author_id',
				'_id'
			],
			populate:[
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
	db:book
});

}