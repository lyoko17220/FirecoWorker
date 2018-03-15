const express = require('express'),
	api = express.Router(),
	users = require('./api/users'),
	folders = require('./api/folders'),
	files = require('./api/files'),
	devices = require('./api/devices');

api.get('/users', (req, res) =>{
	res.json('API destinee aux utilisateurs');
});

api.get('/folders', (req, res) =>{
	res.json('API destinee aux dossiers');
});

api.get('/files', (req, res) =>{
	res.json('API destinee aux fichiers');
});

api.get('/devices', (req, res) =>{
	res.json('API destinee aux périphériques');
});

api.get('/', (req, res) =>{
	res.send('Erreur 418', 418);
});

api.use('/users', users);
api.use('/folders', folders);
api.use('/files', files);
api.use('/devices', devices);

module.exports = api;