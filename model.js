mongoose = require('mongoose')
constants = require('./constants')

var Schema = mongoose.Schema

var usersSchema = new Schema({
	email: String,
	key: String,
	buttons: { type: Array, default: constants.defaultButtons },
	accountHooks: Array,
	logs: Array,
	created: String
});

var Users = mongoose.model('Users', usersSchema);

module.exports = Users;
