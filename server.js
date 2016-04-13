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
var colors      = require("colors");
var favicon     = require('serve-favicon');
var bcrypt      = require('bcrypt');
var jwt         = require('jsonwebtoken'); 
var config      = require('./config'); 
var User        = require('./models/user');
var serverConf = {
  port : 3400,
  ip   : '10.0.0.12',
  start: function() {
    console.log('server started @'.blue    +
                ' http://'.green           +
                serverConf.ip + ':'.green  +
                colors.red(serverConf.port)+
                '/'.green);
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
  _audio =   [ 
               {liked: true},
               {liked: false},
               {liked: false},
               {liked: true},
               {liked: false},
               {liked: false},
               {liked: true},
             ];


function authenticate(req, res, next) {
  //NEED TO SEND BACK USER
  var token = req.body.token     || 
              req.query.token    ||
              req.cookies.auth   ||
              req.headers['x-access-token'];

/*  console.log(
              req.body.token   + "\n"  , 
              req.query.token  + "\n"  ,
              req.cookies.auth + "\n"  ,
              req.headers['x-access-token'] + "\n"
      );*/
  if (token) {
    jwt.verify(token, app.get('superSecret'), 
      function(err, decoded) {
        if (err) {
          console.log(err);
     //     res.json({success:false});
          res.json({
            success: false, 
            message: "Bad Token",
          });
        } else {
          req.decoded = decoded;
          User.findOne({_id: decoded.user._id}, function(err, doc) {
          console.log(doc.toObject());
          doc.password = "hash"
          res.json({
            success: true,
            message: 'Enjoy token!',
            token: token,
            user: doc,
          });

          });
 
       //   next();
        }
      });
  } else {
   // return res.status(403).send({
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
        var token = jwt.sign({user: user}, app.get('superSecret'), {
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
app.get('/api/getInitialData', function(req, res) {
  res.send(_audio);
});

app.post('/api/updateLikes', function(req, res) {
  _audio[req.body.key].liked = !_audio[req.body.key].liked;
  res.json({success: true});
});

var authRoutes = express.Router();
app.post('/api/signup', multipartMiddleware, function(req, res) {
  var uname = req.body.username;
  var pass  = req.body.password;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(pass, salt, function(err, hash) {
      var nick = new User({
        name: uname,
        password: hash,
        admin: true
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

app.post('/api/authenticate', multipartMiddleware, function(req, res) {
  issueToken(req, res, true);
});


authRoutes.use(function(req, res) {
  var token = req.body.token     || 
              req.query.token    ||
              req.cookies.auth   ||
              req.headers['x-access-token'];

  console.log(
              req.body.token   + "\n"  , 
              req.query.token  + "\n"  ,
              req.cookies.auth + "\n"  ,
              req.headers['x-access-token'] + "\n"
      );
  if (token) {
    jwt.verify(token, app.get('superSecret'), 
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
