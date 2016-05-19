//sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3400
//sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 3001

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
var https       = require('https');
var privateKey  = fs.readFileSync('./auth/privkey.pem', 'utf8');
var certificate = fs.readFileSync('./auth/cert.pem', 'utf8');
var chain       = fs.readFileSync('./auth/chain.pem', 'utf8');
var httpServer  = http.createServer(app);
var credentials = { key: privateKey, cert: certificate, ca: chain };
var httpsServer = https.createServer(credentials, app);

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

function ensureSecure(req, res, next){
  if(req.secure){
    return next();
  };
  res.redirect('https://'+req.hostname+req.url);
};

var multipartMiddleware = multipart();
app.all('*', ensureSecure);
app.use('/', express.static(path.join(__dirname, './build')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/uploads',  express.static(__dirname + '/uploads'));
app.use('/assets',  express.static(__dirname + '/assets'));
app.use('/.well-known',  express.static(__dirname + '/.well-known')); // for setting up cert
app.use('/css',  express.static(__dirname + '/css'));
app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(morgan('dev'));
app.disable('etag');

app.get('/ROBOTS.txt', function(req, res) {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow: *\nAllow: /");
})

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
};
var authRoutes = express.Router();
app.post('/api/getListData', function(req, res) {
//change to switch?
  var order = req.body.order;
  var user = req.body.user;
  console.log(order);
  if (order === 'fresh') {
    Audio.find().sort({Posted :-1}).limit(5).exec(function(err, posts){
      res.json(posts);
    });
  } else if (order === 'hot') {
    Audio.find().sort({Likes :-1}).limit(5).exec(function(err, posts){
      res.json(posts);
    });
  } else if (order === 'favs' && user !== undefined) {
    User.find({_id: user._id}, function(err, user) {
      var likedArray = JSON.parse(JSON.stringify(user[0])).liked.slice(0, 5);
      Audio.find({_id: 
        { $in: likedArray }}, 
        function(err, docs) { 
          if (err) console.log(err);
          res.json((docs));
        });
    });
  } else {
    Audio.find().sort({Posted :-1}).limit(5).exec(function(err, posts){
      res.json(posts);
    });
  }
});

app.post('/api/nextPage', function(req, res) {
  var page = req.body.page || 0;
  var order = req.body.order;
  var user = req.body.user;
  if (order === 'fresh') {
    Audio.find().sort({Posted :-1}).skip(page).limit(5).exec(function(err, posts){
      res.json(posts);
    });
  } else if (order === 'hot') {
    Audio.find().sort({Likes :-1}).skip(page).limit(5).exec(function(err, posts){
      res.json(posts);
    });
  } else if (order === 'favs' && user !== undefined) {
    User.find({_id: user._id}, function(err, user) {
      var likedArray = JSON.parse(JSON.stringify(user[0])).liked;
      console.log(likedArray);
      Audio.find({_id: { $in: likedArray }}).sort({Posted: 1}).skip(page).limit(5).exec(function(err, docs) {
        res.json((docs));
      });
    });
  } else {
    Audio.find().sort({Posted :-1}).limit(5).exec(function(err, posts){
      res.json(posts);
    });
  }
});

authRoutes.post('/likeTrack', function (req, res) {
  var uid = req.body.user._id
  console.log(req.body);
  User.findOne({ _id: uid }, function(err, doc) {
    if (err) console.log(err);
    if (!doc) {
      res.json({ success: false, message: "User not found"});
    } else if (doc) {
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
httpsServer.listen(3001, serverConf.ip, function (err, data) {
  console.log(err, data);
});

