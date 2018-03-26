const express = require('express'),
	files = express.Router(),
	fileupload = require('express-fileupload'),
	token = require('randomstring'),
	fs = require('fs'),
	Upload = require('../../db/schemas/upload'),
	Download = require('../../db/schemas/download'),
	Users = require('../../db/schemas/users');

files.get('/upload/request/:user_token', (req, res) =>{
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			let upload = new Upload();

			upload.folder = req.document.file_folder;
			upload.user_token = req.params.user_token;
			upload.token = token.generate(32);
			upload.date = new Date().getTime();

			upload.save((err) => {
				if (err) {
					res.status(404).send('BAD REQUEST');
				}
				res.json({message: 'Token de téléversement ajouté à la base de données'});
			});
		}else{
			res.status(401).send('Vous devez être connecté pour accéder à cette ressouce.');
		}
	});
});

files.get('/download/request/:user_token', (req, res) =>{
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			let download = new Download();
			let date = new Date().getTime();

			download.user_token = doc._id;
			download.token = token.generate(32);
			download.period_start = date;
			download.period_end = date + 604800000;

			download.save((err) => {
				if (err) {
					res.status(404).send(err);
				}
				res.json({message: 'Token de téléchargement ajouté à la base de données'});
			});
		}else{
			res.status(401).send('Vous devez être connecté pour accéder à cette ressouce.');
		}
	});
});

files.get('/download/:user_token/:download_token', (req, res) =>{
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			Download.findOne({'token': req.params.download_token, 'period_end': {$gt : new Date()}}).then((doc2) =>{
				if (doc2) {
					const folder = doc2.folder,
						filename = doc2.filename;
					res.download(folder + '/' + filename, filename);
				}else{
					res.send('Impossible de télécharger le fichier.');
				}
			});
		}else{
			res.status(401).send('Vous devez être connecté pour accéder à cette ressouce.');
		}
	});
});

files.get('/upload/:user_token/:upload_token', (req, res) =>{
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			Upload.findOne({'token': req.params.upload_token}).then((doc2) =>{
				if (doc2){
					let file = req.files.filename;
					const filename = file.name;

					//TODO : Changer chemindacces
					file.mv('chemindacces' + filename, (err) =>{
						if(err){
							res.status(408).send('Délais d\'attente dépassé.');
						}else{
							res.json({message: 'Téléversement effectué'});
						}
					});
				}else{
					res.status(408).send('Délais d\'attente dépassé.');
				}
			});
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