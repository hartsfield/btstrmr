var fs          = require('fs');
var path        = require('path');
var http        = require('http');
var express     = require('express');
var app         = express();
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
var serverConf  = {
  port : config.port,
  ip   : config.ip,
  start: function() {
    mongoose.connect(config.database, function() {
      console.log('server started @'.blue    +
                  ' http://'.green           +
                  serverConf.ip + ':'.green  +
                  colors.red(serverConf.port)+
                  '/'.green);
      console.log("connected to mongodb!")
    });
  }
};


var multipartMiddleware = multipart();
app.use('/', express.static(path.join(__dirname, './build')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(morgan('dev'));
app.disable('etag');

function authenticate(req, res, next) {
  var token = req.body.token     ||
              req.query.token    ||
              req.cookies.auth   ||
              req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.secret,
      function(err, decoded) {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            message: "Bad Token",
          });
        } else {
          req.decoded = decoded;
          User.findOne({_id: decoded.user._id}, function(err, doc) {
            if (err || doc === null) {
              res.json({
                success: false,
                message: 'No such user',
              });
            } else {
              console.log(doc.toObject());
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
      message: 'No token',
    });
  }

}

function issueToken(req, res, pass) {
  User.findOne({
    name: req.body.username
  }, function(err, user) {
    if (err) console.log(err);
    if (!user) {
      res.json({ success: false, message: "User not found"});
    } else if (user && pass) {
      bcrypt.compare(req.body.password, user.password, function(err, hash) {
      if (err) {
        res.json({success: false, message: "Invalid password"});
      } else {
        user.password = "hash";
        console.log(user);
        var token = jwt.sign({user: user}, config.secret, {
          expiresIn: 2000
        });
        res.cookie("auth", token);
        console.log(user.toObject());
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
}

var authRoutes = express.Router();
app.get('/api/getListData', function(req, res) {
  Audio.find().sort({Posted :-1}).limit(5).exec(function(err, posts){
    res.json(posts);
  });
});

authRoutes.post('/likeTrack', function (req, res) {
  console.log(req.body, "dwhwhiewifhiuwehf");
  var uid = req.body.user._id
  User.findOne({ _id: uid }, function(err, doc) {
    if (err) console.log(err);
    if (!doc) {
      res.json({ success: false, message: "User not found"});
    } else if (doc) {
      var info = JSON.parse(JSON.stringify((doc)));
      User.update({_id: uid}, { $addToSet: {liked: req.body.post}}, function (err, results) {
            if (results.nModified) {
        console.log("swqdhwiqudgqwgdigiwgqid");
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



app.post('/api/signup', multipartMiddleware, function(req, res) {
  var uname = req.body.username;
  var pass  = req.body.password;
  console.log(uname, pass);
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(pass, salt, function(err, hash) {
      var nick = new User({
        name: uname,
        password: hash,
      //  admin: true
      });
      nick.save(function(err) {
        if (err) {
          console.log( err );
        } else {
          issueToken(req, res, true);
        }
      });
    });
  });
});

app.post('/api/login', multipartMiddleware, function(req, res) {
  issueToken(req, res, true);
});

app.post('/api/checktoken', function(req, res) {
  authenticate(req, res);
});


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
            message: "Bad Token"
          });
        } else {
          req.decoded = decoded;
          res.json({
            success: true,
            message: 'Enjoy token!',
            token: token,
            user: decoded.user,
          });
        }
      });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token'
    });
  }


});

app.use('/auth', authRoutes);
httpServer.listen(serverConf.port, serverConf.ip, serverConf.start);
