const express = require('express'),
	users = express.Router();

users.post('/sign', (req, res) =>{
	res.json('API destinee a l\'inscription des utilisateurs');
});

users.get('/login', (req, res) =>{
	res.json('API destinee a la connexion des utilisateurs');
});

users.get('/', (req, res) =>{
	res.send('Erreur 418', 418);
});

module.exports = users;