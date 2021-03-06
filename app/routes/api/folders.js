const express = require('express'),
	folders = express.Router(),
	fs = require('fs'),
	path = require('path'),
	Users = require('../../db/schemas/users'),
	rimraf = require('rimraf');

// TODO : Déplacer fichiers et dossiers supprimés dans un dossier 'corbeille' - si l'utilisateur fait une fausse
// TODO : manipulation, il peut toujours restaurer les fichiers / dossiers de la corbeille - si il veut supprimer
// TODO : définitivement, il supprime le contenu de la corbeille

folders.post('/create/:user_token', (req, res) => {
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			let folder_path = '/firecodata' + req.body.path + '/' + req.body.folderName;
			fs.mkdir(folder_path, 0o777, (err) => {
				if (err)
					res.status(400).json({err});
				else
					res.status(200).json({message: 'Dossier créé.'});
			});
		} else {
			res.status(401).json({message: 'Une authentification est requise pour effectuer cette action.'});
		}
	});
});

folders.post('/delete/:user_token', (req, res) => {
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			let folder_path = '/firecodata' + req.body.path + '/' + req.body.folderName;
			rimraf(folder_path, (err) => {
				if (err)
					res.status(400).json({message: 'Le dossier n\'existe pas ou le chemin d\'accès est incorrect.'});
				else
					res.status(200).json({message: 'Dossier supprimé.'});
			});
		} else {
			res.status(401).json({message: 'Une authentification est requise pour effectuer cette action.'});
		}
	});
});

folders.post('/rename/:user_token', (req, res) => {
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			let folder_path = '/firecodata' + req.body.path;
			fs.rename(folder_path + '/' + req.body.folderName, folder_path + '/' + req.body.newName, (err) => {
				if (err)
					res.status(400).json({message: 'Le dossier n\'existe pas ou le chemin d\'accès est incorrect.'});
				else
					res.status(200).json({message: 'Dossier renommé.'});
			});
		} else {
			res.status(401).json({message: 'Une authentification est requise pour effectuer cette action.'});
		}
	});
});

folders.post('/content/:user_token', (req, res) => {
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			let output = {content: []};
			let folderpath = '/firecodata' + req.body.folder;
			fs.readdir(folderpath, (err, files) => {
				if (err) {
					res.status(400).json('Le dossier n\'existe pas ou le chemin d\'accès est incorrect.');
				} else {
					files.forEach(file => {
						let type = 'folder';
						let realpath = path.join(folderpath, file);
						if (fs.statSync(realpath).isFile())
							type = 'file';

						output.content.push({
							'name': file,
							type,
							'path': req.body.folder
						});
					});
					res.status(200).json(output);
				}
			});
		} else {
			res.status(401).json({message: 'Une authentification est requise pour effectuer cette action.'});
		}
	});
});

folders.all('/', (req, res) => {
	res.status(418).json({message: 'Oh non, c\'est un cul de sac ! :('});
});

module.exports = folders;