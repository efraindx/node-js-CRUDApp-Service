
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PersonSchema   = new Schema({
	name: {
	  first: String, 
	  last: String
	},
	email: String
});

module.exports = mongoose.model('Person', PersonSchema);
