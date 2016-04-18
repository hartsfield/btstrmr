var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = mongoose.model('Audio', new Schema({
  Artist : {type: String},
  Album  : {type: String},
  Title  : {type: String},
  Audio  : {type: String},
  Image  : {type: String},
  Year   : {type: Number},
  Likes  : {type: Number, default: 0},
  Listens: {type: Number, default: 0},
  Posted : {type: Date,   default: Date.now}
}));
