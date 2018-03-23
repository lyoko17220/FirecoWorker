const express = require('express'),
	files = express.Router(),
	multer = require('multer'),
	token = require('randomstring'),
	Upload = require('../../db/schemas/upload'),
	Download = require('../../db/schemas/download'),
	Users = require('../../db/schemas/users');

files.get('/upload/request/:user_token', (req, res) =>{
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			let upload = new Upload();
			token.generate(32);
			upload.token = token;
		}else{
			res.status(401).send('Vous devez être connecté pour accéder à cette ressouce.');
		}
	});
});

files.get('/download/request/:user_token', (req, res) =>{
	const user_token = req.params.user_token;
	Users.findOne({'token': user_token}).then((doc) => {
		if (doc) {
			let download = new Download();
			const download_token = token.generate(32);
			download.token = download_token;
			files.use('/download/' + user_token + '/' + download_token);
		}else{
			res.status(401).send('Vous devez être connecté pour accéder à cette ressouce.');
		}
	});
});

files.get('/dowload/:user_token/:download_token', (req, res) =>{
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			res.send('Télécharge mon fichier : ' + req.params.download_token);
		}else{
			res.status(401).send('Vous devez être connecté pour accéder à cette ressouce.');
		}
	});
});

files.get('/upload/:user_token/:upload_token', (req, res) =>{
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			res.send('Upload mon fichier');
		}else{
			res.status(401).send('Vous devez être connecté pour accéder à cette ressouce.');
		}
	});
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