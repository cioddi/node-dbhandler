#node-dbhandler

dbhandler creates a crud webinterface from model config using mongoose (MongoDB) and express

[![Build Status](https://travis-ci.org/cioddi/node-dbhandler.png)](https://travis-ci.org/cioddi/node-dbhandler)

##diagram
![Diagram](https://raw.github.com/cioddi/node-dbhandler/docs/img/diagram.jpg)

##example

```

var authorSchema = new dbhandler.Schema({
  name				: String,
  description	: String,
  created			: {'type': Date, 'default': Date.now}
});


var author = db.model('Author', authorSchema);


app.dbh_models.author = new dbhandler.init({
	path: '/author',
	actions:{
		create:{},
		read:{
			parameters:[
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
	db:author
});

```