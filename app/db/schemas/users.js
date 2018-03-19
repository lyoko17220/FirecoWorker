const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
	username: String,
	lastname: String,
	firstname: String,
	password: String,
	token: String
});

const Users = mongoose.model('Users', usersSchema);
module.exports = Users;