var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = mongoose.model('User', new Schema({
  name       : {type: String, unique : true, required : true, },
  password   : {type: String, required : true},
  email      : {type: String},
  karma      : {type: Number, default: 0},
  heard      : [String],
  liked      : [String],
  submissions: [String],
  created    : {type: Date, default: Date.now}
}));
