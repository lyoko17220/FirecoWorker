const express = require('express'),
	api = express.Router(),
	users = require('./api/users'),
	folders = require('./api/folders'),
	files = require('./api/files'),
	devices = require('./api/devices');

api.all('/users', (req, res) =>{
	res.status(418).json({message: 'Oh non, c\'est un cul de sac ! :('});
});

api.all('/folders', (req, res) =>{
	res.status(418).json({message: 'Oh non, c\'est un cul de sac ! :('});
});

api.all('/files', (req, res) =>{
	res.status(418).json({message: 'Oh non, c\'est un cul de sac ! :('});
});

api.all('/devices', (req, res) =>{
	res.status(418).json({message: 'Oh non, c\'est un cul de sac ! :('});
});

api.all('/', (req, res) =>{
	res.status(418).json({message: 'Oh non, c\'est un cul de sac ! :('});
});

api.use('/users', users);
api.use('/folders', folders);
api.use('/files', files);
api.use('/devices', devices);

module.exports = api;