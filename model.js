mongoose = require('mongoose')
constants = require('./constants')

var Schema = mongoose.Schema

var usersSchema = new Schema({
	email: String,
	key: String,
	buttons: { type: Array, default: constants.defaultButtons },
	accountHooks: Array,
	logs: Array,
	created: new Date().getTime()
});

var Users = mongoose.model('Users', usersSchema);

module.exports = Users;
