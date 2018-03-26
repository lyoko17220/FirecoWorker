require('./db/dbconnect');

const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	port = process.env.PORT_WORKER || 8082,
	view = require('./routes/view'),
	api = require('./routes/api'),
	nunjucks = require('nunjucks');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) =>{
	res.status(301).redirect("/view")
});

app.use('/api', api);
app.use('/view', view);

nunjucks.configure('dashboard/page', {
	autoescape: true,
	express: app
});

app.listen(port, () => {
	console.log('API started on port : ' + port);
});

