const express = require('express'),
	files = express.Router(),
	multer = require('multer'),
	Users = require('../../db/schemas/users');

files.post('/upload/request', (req, res) =>{
	res.json('API destinee a la demande d\'upload d\'un fichier');
});

files.get('/download/request', (req, res) =>{
	res.json('API destinee a la demande de download d\'un fichier');
});

files.delete('/delete', (req, res) =>{
	res.json('API destinee a la suppression d\'un fichier');
});

files.put('/rename', (req, res) =>{
	res.json('API destinee a renommer un fichier');
});

files.get('/', (req, res) =>{
	res.send('Erreur 418', 418);
});

module.exports = files;