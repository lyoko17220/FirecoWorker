const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
	token: String,
	username: String,
	lastname: String,
	firstname: String,
	password: String
});

mongoose.modelSchemas('users', usersSchema);

const downloadSchema = new mongoose.Schema({
	disk: String,
	folders: String,
	user_token: [{
		type: mongoose.Schema.Types.ObjectId, ref: 'users'
	}],
	token: String,
	period_start: Date,
	period_end: Date
});

mongoose.modelSchemas('download', downloadSchema);

const uploadSchema = new mongoose.Schema({
	disk: String,
	folders: String,
	user_token: [{
		type: mongoose.Schema.Types.ObjectId, ref: 'users'
	}],
	token: String,
	date: Date
});

mongoose.modelSchemas('upload', uploadSchema);