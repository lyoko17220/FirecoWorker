require('./db/dbconnect');

const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	port = process.env.PORT_WORKER || 8082,
	api = require('./routes/api');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) =>{
	res.status(418).send('Oh non, c\'est un cul de sac');
});

app.use('/api', api);

app.listen(port, () => {
	console.log('API started on port : ' + port);
});

