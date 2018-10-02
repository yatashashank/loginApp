const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
    firstName: {
		type: String,
		index:true
    },
    lastName: {
		type: String,
		index:true
	},
	userName: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = (newUser, callback) => {
	bcrypt.genSalt(10, (err, salt) => {
	    bcrypt.hash(newUser.password, salt, (err, hash) => {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = (userName, callback) => {
	var query = {userName : userName};
	User.findOne(query, callback);
}

module.exports.getUserById = (id, callback) => {
	User.findById(id, callback);
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if(err) throw err;
		callback(null, isMatch);
	});
}