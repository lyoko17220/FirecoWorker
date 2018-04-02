const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
	path: String,
	file_name: String,
	user_token: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users'
	},
	token: String,
	date: Date
});

const Upload = mongoose.model('Upload', uploadSchema);
module.exports = Upload;