var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({

	ID_user : { type: String, required: true},

	keyword: {type:String}
    //date: {type:Date}
});

 module.exports = mongoose.model('historys', schema);
