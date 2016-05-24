var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = mongoose.model('User', new Schema({
  name       : {type: String,
                minlength: 4,
                maxlength: 15,
                unique : true,
                required : true,
               },
  password   : {type: String,
                minlength: 4,
                required : true,
               },
  email      : {type: String,
                minlength: 4,
                maxlength: 15,
               },
  karma      : {type: Number, default: 0},
  heard      : [String],
  liked      : [String],
  submissions: [String],
  created    : {type: Date, default: Date.now}
}));
