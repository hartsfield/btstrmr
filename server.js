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

// When you first start the Linux server, run these commands so btstrmr doesn't
// need to be run as root. 
// sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3400
// sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 3001

var fs          = require('fs');
var path        = require('path');
var http        = require('http');
var express     = require('express');
var app         = express();
var compression = require('compression');
var httpServer  = http.createServer(app);
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var cookieParser= require('cookie-parser');
var multipart   = require('connect-multiparty');
var mongoose    = require('mongoose');
var colors      = require("colors");
var favicon     = require('serve-favicon');
var bcrypt      = require('bcrypt');
var jwt         = require('jsonwebtoken');
var config      = require('./config.js');
var User        = require('./models/user.js');
var Audio       = require('./models/audio.js');
var https       = require('https');
var privateKey  = fs.readFileSync('./auth/privkey.pem', 'utf8');
var certificate = fs.readFileSync('./auth/cert.pem', 'utf8');
var chain       = fs.readFileSync('./auth/chain.pem', 'utf8');
var httpServer  = http.createServer(app);
var credentials = { key: privateKey, cert: certificate, ca: chain };
var httpsServer = https.createServer(credentials, app);

// Connection settings for mongodb
var mongoConf = {
  // Reconnect on error
  'auto_reconnect': true,
  // Set the maximum poolSize for each individual server or proxy connection.
  'poolSize': 5,
}

// Configure the server. 
var serverConf  = {
  port : config.port,
  ip   : config.ip,
  // Start is used as a callback function for connecting to mongo and logging
  // a start up message after we start the server.
  start: function() {
    // connect to mongodb
    mongoose.connect(config.database, mongoConf, function(err) {
      if (err) {
        console.log("ERROR!!!".bold.red + " Something went wrong" +
                    " conecting to mongodb. Make "  +
                    "sure you've started the service.")
      } else {
        console.log("connected to mongodb!")
      };
      // Log the address the server is running on.
        console.log('server started @'.blue    +
                    ' http(s)://'.green           +
                    serverConf.ip + ':'.green  +
                    colors.red(serverConf.port)+
                    '/'.green);

    });
  }
};

// ensureSecure is used for making sure all connections are routed through SSL.
function ensureSecure(req, res, next){
  if (req.secure) {
    return next();
  } else {
    res.redirect('https://'+req.hostname+req.url);
  }
};

// Initialize multipartMiddleware used for multipart data.
var multipartMiddleware = multipart();
// app.all('*');
// Make sure all connections are secure.
app.all('*', ensureSecure);
// Use compression to comply with google web standards.
app.use(compression());
// The code for our website (after it's built).
app.use('/', express.static(path.join(__dirname, './build')));
// Allow access to /bower_components, /uploads, /assets, etc.
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/uploads',  express.static(__dirname + '/uploads'));
app.use('/assets',  express.static(__dirname + '/assets'));
app.use('/css',  express.static(__dirname + '/css'));
// app.use('/.well-known',  express.static(__dirname + '/.well-known')); // for setting up cert.
// Allow express to parse cookies used for identification and accept json and
// urlencoded data.
app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// http request logger/middleware.
app.use(morgan('dev'));
// app.disable('etag');

// Take care of web crawlers.
app.get('/ROBOTS.txt', function(req, res) {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow: *\nAllow: /");
});

// Authenticate is used for signing up and checking auth tokens on certain
// requests.
function authenticate(req, res, next) {
  var token = req.body.token     ||
              req.query.token    ||
              req.cookies.auth   ||
              req.headers['x-access-token'];
  // If the user has a token we validate it. The users identity is stored in the
  // token and that information is further validated. 
  if (token) {
    jwt.verify(token, config.secret,
      function(err, decoded) {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            ignore: true,
            message: "Bad Token",
          });
        } else {
          req.decoded = decoded;
          // Look up the user in the database and send back relevant data.
          User.findOne({_id: decoded.user._id}, function(err, doc) {
            if (err || doc === null) {
              res.json({
                success: false,
                ignore: true,
                message: 'No such user',
              });
            } else {
              // console.log(doc.toObject());
              // Remove the hashed password before sending back a fresh token.
              doc.password = "hash"
              res.json({
                success: true,
                message: 'Enjoy token!',
                token: token,
                user: doc,
              });
            }
          });
       //   next();
        }
      });
  } else {
    res.json({
      success: false,
      ignore: true,
      message: 'No token',
    });
  }

}

// issueToken issues a new token on sign in.
function issueToken(req, res, pass) {
  User.findOne({
    name: req.body.username
  }, function(err, user) {
    if (err) console.log(err);
    if (!user) {
      res.json({ success: false, message: "User not found"});
    } else if (user && pass) {
      // test password
      bcrypt.compare(req.body.password, user.password, function(err, hash) {
        // invalid password
        if (err || !hash) {
          res.json({success: false, message: "Invalid password"});
        } else {
          // Remove the password hash and replace it with the text "hash".
          user.password = "hash";
          // Create the token with the users data.
          var token = jwt.sign({user: user}, config.secret, {
            expiresIn: 1025000
          });
          // Set the cookie.
          res.cookie("auth", token);
          // console.log(user.toObject());
          // Issue the token and user data to the client.
          res.json({
            success: true,
            message: 'Enjoy token!',
            token: token,
            user: user,
          });
        }
      });
    }
  });
};

// sortLikes is used in the API to sort the liked songs retrieved from the 
// database in the order that the user originally liked them in.
function sortLikes(original, liked) {
  var newArr = [];
  for (var i = 0, len = original.length; i < len; i++) {
    // newArr[n] = original[i] where n is the score found in the users "liked"
    // array.
    newArr[liked.indexOf(original[i]._id.toString())] = original[i];
  }
  return newArr;
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// BTSTRMR API
//
// PUBLIC
// /api/getListData    Returns the audio data to the client
// /api/nextPage       Returns the next page of data (5 tracks)
// /api/signup         Creates a new account
// /api/login          Allows existing users to login to an account
// /api/checkToken     Checks the users JSON web token
//
// AUTHORIZED
// /likeTrack          Like a track
//
//
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// authRoutes is used for api routes that require authorization, we initialize
// the router at the beginning of the API.
var authRoutes = express.Router();

// /api/getListData gets the initial data for the app
app.post('/api/getListData', function(req, res) {
  var order = req.body.order;
  var user = req.body.user;
  console.log(order);
  // Change to switch?
  // Get the most recently posted songs, limited to 5 at a time.
  if (order === 'fresh') {
    Audio.find().sort({Posted :-1}).limit(5).exec(function(err, posts){
      if (err) {
        console.log(err);
      }
      res.json(posts);
    });
  // Get the most liked songs, limited to 5 at a time.
  } else if (order === 'hot') {
    Audio.find().sort({Likes :-1}).limit(5).exec(function(err, posts){
      if (err) {
        console.log(err);
      }
      res.json(posts);
    });
    // Get the users favorite songs, limited to 5 at a time.
  } else if (order === 'favs' && user !== undefined) {
    User.find({_id: user._id}, function(err, user) {
      if (err) {
        console.log(err);
      }
      // Reverse, slice. and parse.
      var likedArray = JSON.parse(JSON.stringify(user[0])).liked.reverse().slice(0, 5);
      // Find all the songs matching the objectIds in the users liked array.
      Audio.find({_id: { $in: likedArray }}).skip(0).limit(5).exec(function(err, docs) {
        if (err) {
          console.log(err);
        }
        // The documents aren't retrieved in the order that the user originally
        // saved them in, but the likes are saved in the proper order in the 
        // user profile, sortLikes() is used to sort them out.
        var senddoc = sortLikes(docs, likedArray);
        res.json(senddoc);
      });
    });
  } else {
    // By default get the most recently posted songs, limited to 5 at a time.
    Audio.find().sort({Posted :-1}).limit(5).exec(function(err, posts){
      if (err) {
        console.log(err);
      }
      res.json(posts);
    });
  }
});

// /api/nextPage is almost exactly the same as /api/getListData, but combining
// them requires extra funky logic, so they've been separated. 
app.post('/api/nextPage', function(req, res) {
  var page = req.body.page || 0;
  var order = req.body.order;
  console.log(page, order);
  var user = req.body.user;
  // Depending on the order. get the next 5 tracks, main diference between this
  // and /api/getListData is that this use the "skip" functionality of mongodb.
  if (order === 'fresh') {
    Audio.find().sort({Posted :-1}).skip(Number(page)).limit(5).exec(function(err, posts){
      if (err) {
        console.log(err);
      }
      res.json(posts);
    });
  } else if (order === 'hot') {
    Audio.find().sort({Likes :-1}).skip(Number(page)).limit(5).exec(function(err, posts){
      if (err) {
        console.log(err);
      }
      res.json(posts);
    });
  } else if (order === 'favs' && user !== undefined) {
    User.find({_id: user._id}, function(err, user) {
      var likedArray = JSON.parse(JSON.stringify(user[0])).liked.reverse().splice(page, 5);
      Audio.find({_id: { $in: likedArray }}).exec(function(err, docs) {
        var senddoc = sortLikes(docs, likedArray);
        res.json(senddoc);
      });
    });
  } else {
    Audio.find().sort({Posted :-1}).limit(5).exec(function(err, posts){
      if (err) {
        console.log(err);
      }
      res.json(posts);
    });
  }
});

// /api/signup is used for signing up new accounts.
app.post('/api/signup', multipartMiddleware, function(req, res) {
  // Here we get the user name and password and make sure the user name 
  // complies with the RegExp.
  var uname = req.body.username;
  var pass  = req.body.password;
  var nameRegex = /^[a-zA-Z0-9\-]{4,15}$/;
  if (!nameRegex.test(uname)) {
    res.json({success: false, message: "Bad Username"});
  } else {
    // Use bcrypt to salt and encrypt the password.
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(pass, salt, function(err, hash) {
        // create a document
        var nick = new User({
          name: uname,
          password: hash,
        //  admin: true
        });
        // Attempt to save the document to our database. If the save fails it
        // generally means the user exists.
        nick.save(function(err) {
          if (err) {
            console.log(err)
            res.json({success: false, message: "User Exists"});
          } else {
            issueToken(req, res, true);
          }
        });
      });
    });
  }
});

// /api/login just uses issueToken(), as the functionality to login a user 
// exists within it already.
app.post('/api/login', multipartMiddleware, function(req, res) {
  issueToken(req, res, true);
});

// /api/checktoken just uses authenticate() to validate user tokens
app.post('/api/checktoken', function(req, res) {
  authenticate(req, res);
});

/*
// /api/uploadAudioContent allows you to upload audio, but the code is commented
// out in production to prevent abuse
app.post('/api/uploadAudioContent', multipartMiddleware, function(req, res) {

  var rb = req.body;
  var rf  = req.files;
  //console.log(req.files);

  if (rb.Artist && rb.Title && rf.Song && rf.Image) {
    //console.log("success");

    fs.readFile(rf.Song.path, function (err, data) {
      var newPath = "./uploads/audio/" + rb.Artist + "-" + rb.Title + ".mp3";
      fs.writeFile(newPath, data, function (err) {
        //console.log("file write", err);
      });
    });

    fs.readFile(rf.Image.path, function (err, data) {
      var newPath = "./uploads/image/" + rb.Artist + "-" + rb.Title;
      fs.writeFile(newPath, data, function (err) {
        //console.log("file write", err);
      });
    });

    var newSongData = new Audio({
      Artist : req.body.Artist,
      Album  : req.body.Album,
      Title  : req.body.Title,
      Audio  : "/uploads/audio/" + rb.Artist + "-" + rb.Title,
      Image  : "/uploads/image/" + rb.Artist + "-" + rb.Title,
    });

    newSongData.save(function(err) {
      if (err) console.log(err);
      res.json({success:true});
    });
  }

});
*/

// /likeTrack is an authorized rout (meaning it requires a user to be logged in)
// and it allows them to "like" a track and add it to their collection, or
// "unlike" a track and remove it from their collection.
authRoutes.post('/likeTrack', function (req, res) {
  // Look up user.
  var uid = req.body.user._id
  User.findOne({ _id: uid }, function(err, doc) {
    if (err) console.log(err);
    if (!doc) {
      res.json({ success: false, message: "User not found"});
    } else if (doc) {
      // if we find the user, we use $addToSet to add the post to the "liked"
      // set, then test whether anything was modified, if so, that means we
      // successfully added the track to the users "liked" set and that we need
      // to increment the number of likes associated with the track else, it 
      // means the track already existed in the users "liked" set and the user 
      // wants to remove it, so we need to decrement the number of "likes".
      var info = JSON.parse(JSON.stringify((doc)));
      User.update({_id: uid}, { $addToSet: {liked: req.body.post}}, function (err, results) {
        if (results.nModified) {
          Audio.update({ "_id": req.body.post},
            { $inc: {"Likes": 1} },
            function(err, model) {
              if (err) console.log(err);
              res.json({
                user: info,
                success: true,
              });
            }
          );
        } else {
          User.update({_id: uid}, { $pull: {liked: req.body.post}}, function(err, results) {
            Audio.update({ "_id": req.body.post},
              { $inc: {"Likes": -1} },
              function(err, model) {
                if (err) console.log(err);
                res.json({
                  user: info,
                  success: true,
                });
              }
            );
          });
        }
      });
    }
  });
});


// Here we define the requirements for using the authorized api paths. You just
// need a valid token.
authRoutes.use(function(req, res) {
  var token = req.body.token     ||
              req.query.token    ||
              req.cookies.auth   ||
              req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.secret,
      function(err, decoded) {
        if (err) {
          console.log(err);
          return res.status(403).send({
            success: false,
            ignore: true,
            message: "Bad Token"
          });
        } else {
          req.decoded = decoded;
          res.json({
            success: true,
            message: 'Enjoy token!',
            token: token,
            ignore: true,
            user: decoded.user,
          });
        }
      });
  } else {
    return res.status(403).send({
      success: false,
      ignore: true,
      message: 'No token'
    });
  }


});

// Tell express to use the authRoutes function for /auth (needs to be defined
// here).
app.use('/auth', authRoutes);

// Start the https server and http for fallback (but theoretically everything
// should always be encrypted).
httpServer.listen(serverConf.port, serverConf.ip, serverConf.start);
httpsServer.listen(3001, serverConf.ip, function (err, data) {
  if (err) console.log(err);
  console.log("ssl is ready".green);
});

