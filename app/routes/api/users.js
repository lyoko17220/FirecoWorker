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
					res.status(404).send(err);
				}
				res.json({message: 'Utilisateur créer et inséré dans la base Mongo !'});
			});
		} else {
			res.status(404).send('Utilisateur déjà existant.');
		}
	});

});

// TODO : Gérer les codes d'erreurs HTML
users.post('/login', (req, res) => {
	Users.findOne({'username': req.body.username}).then((doc) => {
		if(doc){
			if(bcrypt.compareSync(req.body.password, doc.password)){
				res.json(doc);
			}else{
				res.status(404).send('Le nom d\'utilisateur ou le mot de passe ne correspond pas.');
			}
		}else{
			res.status(404).send('Utilisateur non trouvé');
		}
	});

});

users.get('/', (req, res) => {
	res.status(418).send('Oh non, c\'est un cul de sac');
});

module.exports = users;