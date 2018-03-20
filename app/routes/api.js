const express = require('express'),
	api = express.Router(),
	users = require('./api/users'),
	folders = require('./api/folders'),
	files = require('./api/files'),
	devices = require('./api/devices');

api.all('/users', (req, res) =>{
	res.json('API destinee aux utilisateurs');
});

api.all('/folders', (req, res) =>{
	res.json('API destinee aux dossiers');
});

api.all('/files', (req, res) =>{
	res.json('API destinee aux fichiers');
});

api.all('/devices', (req, res) =>{
	res.status(418).send('Oh non, c\'est un cul de sac');
});

api.all('/', (req, res) =>{
	res.send('Erreur 418', 418);
});

api.use('/users', users);
api.use('/folders', folders);
api.use('/files', files);
api.use('/devices', devices);

module.exports = api;