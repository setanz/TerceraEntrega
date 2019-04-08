const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const matriculaSchema = new Schema({
	documento : {
		type: Number,
		required: true	
	},
	cursoId : {
		type: Number,
		required: true
	}
});

matriculaSchema.plugin(uniqueValidator);

const Matricula = mongoose.model('Matricula', matriculaSchema);

module.exports = Matricula