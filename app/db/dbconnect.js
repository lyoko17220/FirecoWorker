const mongoose = require('mongoose'),
	dbURI = 'mongodb://localhost:27017/fireco';

mongoose.connect(dbURI);

mongoose.connection.on('connected', () =>{
	console.log('Mongoose default connection open to ' + dbURI);
});

mongoose.connection.on('error', (err) =>{
	console.log('Mongoose default connection error : ' + err);
});

process.on('SIGINT', () =>{
	mongoose.connection.close(() =>{
		console.log('Mongoose default connection disconnected through app termination');
		process.exit(0);
	});
});
