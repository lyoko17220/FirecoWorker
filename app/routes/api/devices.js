const express = require('express'),
	devices = express.Router(),
	drivelist = require('drivelist'),
	Users = require('../../db/schemas/users');

// TODO : Copier les données de la liste afin de ne garder que les principales
devices.get('/:user_token', (req, res) => {
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			drivelist.list((err, drives) => {
				if (err)
					res.status(404).json({message: 'Ressource introuvable.'});
				else
					res.status(200).json(drives);
			});
		}else{
			res.status(401).json({message: 'Vous devez être connecté pour accéder à cette ressouce.'});
		}
	});
});

devices.all('/', (req, res) =>{
	res.status(418).json({message: 'Oh non, c\'est un cul de sac ! :('});
});

module.exports = devices;