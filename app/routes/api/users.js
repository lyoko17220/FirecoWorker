const express = require('express'),
	users = express.Router(),
	Users = require('../../db/schemas/users'),
	bcrypt = require('bcryptjs'),
	mongoose = require('mongoose');

// TODO : Gérer les codes d'erreurs HTML - Gérer la longueur du mot de passe
users.post('/sign', (req, res) => {
	Users.findOne({'username': req.body.username}).then((doc) => {
		if (!doc) {
			let hash = bcrypt.hashSync(req.body.password, 10);
			let user = new Users();
			let token = new mongoose.mongo.ObjectId();
			user._id = token;
			user.username = req.body.username;
			user.lastname = req.body.lastname;
			user.firstname = req.body.firstname;
			user.password = hash;
			user.token = token;

			user.save((err) => {
				if (err) {
					res.status(400).json(err);
				}
				res.json({
					token: token
				});
			});
		} else {
			res.status(400).json('Utilisateur déjà existant.');
		}
	});

});

// TODO : Gérer les codes d'erreurs HTML
users.post('/login', (req, res) => {
	Users.findOne({'username': req.body.username}).then((doc) => {
		if (doc) {
			if (bcrypt.compareSync(req.body.password, doc.password)) {
				res.json({
					token: doc.token
				});
			} else {
				res.status(400).json('Le nom d\'utilisateur ou le mot de passe ne correspond pas.');
			}
		} else {
			res.status(400).json('Utilisateur non trouvé');
		}
	});
});

users.get('/infos/:user_token', (req, res) => {
	Users.findOne({'token': req.params.user_token}).then((doc) => {
		if (doc) {
			res.json({
				firstname: doc.firstname,
				lastname: doc.lastname,
				username: doc.username
			});
		} else {
			res.status(400).json('Utilisateur non trouvé');
		}
	});
});

users.get('/', (req, res) => {
	res.status(418).json('Oh non, c\'est un cul de sac');
});

module.exports = users;