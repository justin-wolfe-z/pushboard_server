var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
	account: String,
	buttons: Array
});

var Users = mongoose.model('Users', usersSchema);

// make this available to our users in our Node applications
module.exports = Users;
