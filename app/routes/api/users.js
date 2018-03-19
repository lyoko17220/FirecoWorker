const express = require('express'),
	users = express.Router(),
	Users = require('../../db/schemas/users'),
	bcrypt = require('bcrypt');

// TODO : Gérer les codes d'erreurs HTML - Gérer la longueur du mot de passe
users.post('/sign', (req, res) => {
	Users.findOne({'username': req.body.username}).then((doc) => {
		if (!doc) {
			let hash = bcrypt.hashSync(req.body.password, 10);
			let token = bcrypt.hashSync(req.body.username + hash, 10);
			let user = new Users();
			user.username = req.body.username;
			user.lastname = req.body.lastname;
			user.firstname = req.body.firstname;
			user.password = hash;
			user.token = token;

			user.save((err) => {
				if (err) {
					res.status(404).send('BAD REQUEST');
				}
				res.send({message: 'Utilisateur créer et inséré dans la base Mongo !'});
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
	res.send('Erreur 418', 418);
});

module.exports = users;