const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const aspiranteSchema = new Schema({
	nombre : {
		type : String,
		required : true	,
		trim : true
	},
	correo :{
		type : String,
		required : true
	},
	documento : {
		type: Number,
		required: true	
	},
	telefono : {
		type: Number,
		required: true			
	},
	tipo : {
		type: String,
		required: true
	}
});

aspiranteSchema.plugin(uniqueValidator);

const Aspirante = mongoose.model('Aspirante', aspiranteSchema);

module.exports = Aspirante