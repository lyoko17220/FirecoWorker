const express = require('express'),
	files = express.Router(),
	multer = require('multer'),
	token = require('randomstring'),
	fs = require('fs'),
	Upload = require('../../db/schemas/upload'),
	Download = require('../../db/schemas/download'),
	Users = require('../../db/schemas/users');

// TODO : Déplacer fichiers et dossiers supprimés dans un dossier 'corbeille' - si l'utilisateur fait une fausse
// TODO : manipulation, il peut toujours restaurer les fichiers / dossiers de la corbeille - si il veut supprimer
// TODO : définitivement, il supprime le contenu de la corbeille

// TODO : Ajouter un blocage. 1 requête = 1 action


files.post('/upload/request/:user_token', (req, res) => {
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			let upload = new Upload();
			let date = new Date();
			let upload_token = token.generate(16);

			upload.path = req.body.path;
			upload.user_token = doc._id;
			upload.token = upload_token;
			upload.date = date.getTime();

			upload.save((err) => {
				if (err) {
					res.status(400).json({message: 'Le fichier n\'existe pas ou le chemin est incorrect.'});
				}
				//res.status(200).json({token: upload_token});
				res.status(200).json(upload);
			});
		} else {
			res.status(401).json({message: 'Une authentification est requise pour effectuer cette action.'});
		}
	});
});

files.post('/download/request/:user_token', (req, res) => {
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			let download = new Download();
			let date = new Date().getTime();
			let download_token = token.generate(16);

			download.user_token = doc._id;
			download.folder = req.body.folder;
			download.filename = req.body.filename;
			download.token = download_token;
			download.period_start = date;
			download.period_end = date + 604800000;

			download.save((err) => {
				if (err) {
					res.status(404).json({err});
				}
				res.status(200).json({token: download_token});
			});
		} else {
			res.status(401).send('Vous devez être connecté pour accéder à cette ressouce.');
		}
	});
});

files.get('/download/:user_token/:download_token', (req, res) => {
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			Download.findOne({'token': req.params.download_token, 'period_end': {$gt: new Date()}}).then((doc2) => {
				if (doc2) {
					const folder = '/firecodata' + doc2.folder,
						filename = doc2.filename;

					res.download(folder + '/' + filename, filename);
				} else {
					res.json({message: 'Impossible de télécharger le fichier'});
				}
			});
		} else {
			res.status(401).json({message: 'Vous devez être connecté pour accéder à cette ressouce.'});
		}
	});
});

files.post('/upload/:user_token/:upload_token', (req, res) => {
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			Upload.findOne({'token': req.params.upload_token}).then((doc2) => {
				if (doc2) {
					let storage = multer.diskStorage({
						destination: '/firecodata' + doc2.path,
						filename: (req, file, cb) =>{
							cb(null, file.originalname + '_' + Date.now());
						}
					});

					let upload = multer({ storage: storage}).single('fileUpload');

					upload(req, res, (err) =>{
						if(err)
							res.status(400).json({message: 'Impossible de téléverser le fichier.'});
						res.status(200).json({message: 'Fichier uploadé.'});
					});
				} else {
					res.status(408).json({message: 'Délais d\'attente dépassé.'});
				}
			});
		} else {
			res.status(401).json({message: 'Une authentification est requise pour effectuer cette action.'});
		}
	});
});

files.post('/delete/:user_token', (req, res) => {
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			let file_path = '/firecodata' + req.body.path + '/' + req.body.file_name;
			fs.unlink(file_path, (err) => {
				if (err)
					res.status(400).json({message: 'Le fichier n\'existe pas ou le chemin d\'accès est incorrect.'});
				res.status(200).json({message: 'Fichier supprimé.'});
			});
		} else {
			res.status(401).json({message: 'Une authentification est requise pour effectuer cette action.'});
		}
	});
});

files.post('/rename/:user_token', (req, res) => {
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			let file_path = '/firecodata' + req.body.path;
			fs.rename(file_path + '/' + req.body.file_name, file_path + '/' + req.body.new_file_name, (err) => {
				if (err)
					res.status(400).json({message: 'Le fichier n\'existe pas ou le chemin d\'accès est incorrect.'});
				res.status(200).json({message: 'Fichier renommé.'});
			});
		} else {
			res.status(401).json({message: 'Une authentification est requise pour effectuer cette action.'});
		}
	});
});

files.all('/', (req, res) => {
	res.status(418).json({message: 'Oh non, c\'est un cul de sac ! :('});
});

module.exports = files;