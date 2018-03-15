const express = require('express'),
	folders = express.Router();

folders.post('/create', (req, res) =>{
	res.json('API destinee a la creation de dossiers');
});

folders.delete('/delete', (req, res) =>{
	res.json('API destinee a la suppression de dossiers');
});

folders.put('/rename', (req, res) =>{
	res.json('API destinee pour renommer les dossiers');
});

folders.get('/', (req, res) =>{
	res.send('Erreur 418', 418);
});

module.exports = folders;