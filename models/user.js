///////////////////////////////////////////////////////////////////////////////
//  Copyright (c) 2017 J. Hartsfield
                                                                               
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
                                                                               
//  The above copyright notice and this permission notice shall be included in all
//  copies or substantial portions of the Software.
                                                                               
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//  SOFTWARE.
///////////////////////////////////////////////////////////////////////////////

// The User schema is the model for our user data
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
  // Not required yet, but could come in useful
  email      : {type: String,
                minlength: 4,
                maxlength: 15,
               },
  // Eventually users will be able to upload songs and earn karma
  karma      : {type: Number, default: 0},
  // Not implemented yet, but this feature will allow users to trac all the
  // songs they listen to.
  heard      : [String],
  liked      : [String],
  submissions: [String], // Not implmented yet
  created    : {type: Date, default: Date.now} // Date account was created 
}));
