const mongoose = require('mongoose');

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

const Download = mongoose.model('Download', downloadSchema);