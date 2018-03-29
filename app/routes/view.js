const express = require('express'),
    view = express.Router(),
	path = require('path');

view.use('/css', express.static(__dirname + '/../node_modules/bootstrap/dist/css'));
view.use('/ressources', express.static(__dirname + '/../dashboard/ressources'));

view.get('/', function(req, res){
	res.render('homePage.html');
});

view.get('/navbar', function(req, res){
	res.render('layout.html');
});

view.get('/table', function(req, res){
	res.render('table.html');
});

view.get('/login', function (req, res){
	res.render('login.html');

});

view.get('/home', function (req, res){
	res.render('homePage.html');

});

view.get('/subscription', function (req, res){
	res.render('subscription.html');

});

module.exports = view;