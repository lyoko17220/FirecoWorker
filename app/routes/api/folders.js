const express = require('express'),
	folders = express.Router(),
	fs = require('fs'),
	path = require('path'),
	Users = require('../../db/schemas/users');

folders.post('/create', (req, res) => {
	res.json('API destinee a la creation de dossiers');
});

folders.delete('/delete', (req, res) => {
	res.json('API destinee a la suppression de dossiers');
});

folders.put('/rename', (req, res) => {
	res.json('API destinee pour renommer les dossiers');
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
							'path': folderpath
						});
					});
					res.json(output);
				}
			});
		} else {
			res.status(401).json({message: 'Une authentification est requise pour effectuer cette action.'});
		}
	});
});

folders.get('/', (req, res) => {
	res.status(418).json({message: 'Oh non, c\'est un cul de sac ! :('});
});

module.exports = folders;