const express = require('express'),
	devices = express.Router();

devices.get('/list', (req, res) =>{
	res.json('API destinee a la liste des devices');
});

devices.get('/', (req, res) =>{
	res.send('Erreur 418', 418);
});

module.exports = devices;