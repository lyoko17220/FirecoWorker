const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
	disk: String,
	folders: String,
	user_token: [{
		type: mongoose.Schema.Types.ObjectId, ref: 'users'
	}],
	token: String,
	date: Date
});

const Upload = mongoose.model('Upload', uploadSchema);