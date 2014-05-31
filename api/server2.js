var express = require('express')
var nodemailer = require('nodemailer')
var myut = require('./util/myutil')
var passport = require('passport')
var ppstuff = require('./util/ppstuff')
var util = require('util')
var LocalStrategy = require('passport-localapikey').Strategy;
/*--------------------------------setup db-------------------------------------------*/
var MongoClient = require('mongodb').MongoClient
var Server = require('mongodb').Server
var db
//to translate mongo id string to mongo _id
var ObjectId = require('mongoose').Types.ObjectId;
var util = require('./util/myutil.js')
var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {
    db = mongoClient.db("stuffDb");
    db.collection('users', {strict:true}, function(err, collection) {
      if (err) {
        console.log("The 'users' collection doesn't exist. Creating it with sample data...");
        myut.populateDB(db, myut.inidata.users);
        db.collection('users', function(err, collection) {
          collection.ensureIndex({name:1},{unique:true}, function(err, saved) {
              //console.log(err);
          });
        });
      };
    });  
    //console.log(db)
    db.collection('lists', {strict:true}, function(err, collection) {
      if (err) {
        console.log("The 'lists' collection doesn't exist. Creating it with sample data...");
        myut.populateDB(db, myut.inidata.lists);
        db.collection('lists', function(err, collection) {
          collection.ensureIndex({lid:1}, function(err, saved) {
              //console.log(err);
          });
        });        
      }
    });   
}); 
/*-----------------------------setup mailer-----------------------------------*/
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "mckenna.tim@gmail.com",
        pass: "gonji9ol"
    }
});  


/*-----------------------------setup passport-----------------------------------*/
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  ppstuff.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(apikey, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      ppstuff.findByApiKey(apikey, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown api ' + apikey }); }
        if (user.apikey!=apikey) { return done(null, false, { message: 'apikey' }); }
        return done(null, user);
      })
    });
  }
)); 
/*-----------------------------setup app-----------------------------------*/
var app = express();
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/../../public'));
});

app.all('*', function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-xsrf-token");
  next();
});


app.get('/api/', function(req, res) {
  res.jsonp('please select a collection, lists, users or items')
});

/*-----------------------------setup auth-----------------------------------*/

//curl -v -d "apikey=1234567" http://127.0.0.1:3000/api/authenticate -c cookies.txt
//curl -c cookies.txt -b cookies.txt -G http://127.0.0.1:3000/api/account
//node_modules/vows/bin/vows  test/strategy-spec.js  --spec
app.post('/api/authenticate', 
  passport.authenticate('localapikey', { failureRedirect: '/api/unauthorized'}),
  function(req, res) {
     res.jsonp(req.user)
  });

app.get('/api/account', ppstuff.ensureAuthenticated, function(req, res){  
  res.jsonp(req.user)
});

app.get('/api/unauthorized', function(req, res){
  req.logout();
  res.jsonp({ message: "Authentication Error" })
});
/*-----------------------------user routes-----------------------------------*/
app.get('/api/users', function(req, res) {
    console.log('in findLists');
    myut.find(db, 'users', res);
});
app.post('/api/users', function(req, res){
  console.log('in createUser');
  console.log(req.body);
  var body= req.body; 
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
  db.collection('users', function(err, collection) {
      collection.insert(body, function(err, saved) {
          if(err){res.jsonp(err)}else{res.jsonp(saved)};
      });
  });      
}); //POST=Create
app.del('/api/users/:name', function(req, res){
  console.log('in delete user by name');
  console.log(req.params);
  var name = req.params.name;
  db.collection('users', function(err, collection) {
    collection.remove({name:name}, function(err, saved) {
      if(err){res.jsonp(err)}else{res.jsonp(saved)};
    });
  });      
});
app.get('/api/users/:name', function(req, res) {
    console.log('in find user by name');
    console.log(req.params);
    var name = req.params.name;
    db.collection('users', function(err, collection) {
        collection.findOne({name:name},function(err, items) {
            console.log(items);
            res.jsonp(items);
        });
    });
});
app.get('/api/isUser/:name', function(req, res) {
    console.log('in isUser by name');
    var name = req.params.name;
    db.collection('users', function(err, collection) {
        collection.findOne({name:name},function(err, items) {
          console.log(items)            
            if(items != null && items.name==req.params.name){
              console.log('is registered')
              res.jsonp({message: ' already registered'})
            } else {
              res.jsonp({message: ' available'});
            }           
        });
    });
});
app.get('/api/isMatch/', function(req, res) {
  console.log('in isMatch');
  var user= req.query.user;
  var email= req.query.email;
  db.collection('users', function(err, collection) {
    var andLen =0;
    var orLen=0;
    collection.find({name:user, email:email}).toArray(function(err, items) {
      console.log(items)  
      console.log(items.length)
      andLen = items.length
      collection.find({$or: [{name:user}, {email:email}]}).toArray(function(err, items) {
        console.log(items)  
        console.log(items.length)
        orLen = items.length
        if (andLen+orLen==0){
          res.jsonp({message: 'available'});
          console.log('available')                   
        } else if(andLen==1 & orLen==1){
          res.jsonp({message: 'match'});                   
          console.log('match')                   
        } else {
          res.jsonp({message: 'conflict'});                   
          console.log('conflict')                   
        }             
      });        
    }); 
  });    
});
app.get('/api/emailKey/:name', function(req, res) {
    console.log('in emailKey by name');
    var name = req.params.name;
    db.collection('users', function(err, collection) {
        collection.findOne({name:name},function(err, items) {
          console.log(items);
          var mailOptions = {
            from: "Stuff2Get <mckenna.tim@gmail.com>", // sender address
            to: items.email, // list of receivers
            subject: "apikey", // Subject line
            text: "Your apikey for stuff2get is: " +items.apikey + "Return to the web page and enter your apikey to complete registration for your device", // plaintext body
            html: "<b>Your apikey for stuff2get is: " +items.apikey + "</b><p>Return to the web page and enter your apikey to complete registration for your device </b></p>" // html body
        }

        // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + response.message);
            }
        smtpTransport.close(); // shut down the connection pool, no more messages
        });
          if(err){res.jsonp(err)}else{
            res.jsonp({message: 'check your email and come back'})                 
          };
        });
    });
});
app.put('/api/users/:name/:lid', function(req, res){
  console.log('in addList2user');
  var name =req.params.name; 
  var lid =req.params.lid;
  var shopName;
  //var ObjectId = require('mongoose').Types.ObjectId;
  db.collection('lists', function(err, collection) {
    collection.findOne({lid:lid}, function(err, alist) {
      if(err){
        res.jsonp(err);
      }else if (alist==null){
        res.jsonp("null list with that lid");
      } else {
        shopName=alist.shops
        db.collection('users', function(err, collection) {
          collection.find({name:name},{lists:{$elemMatch:{lid:lid}}}).toArray(function(err,userLid){
            //console.log(userLid[0].lists==undefined)
            //console.log(userLid[0].lists)
            if (err){
              ret.jsonp(err)
            }else if(userLid[0].lists!=undefined){
              console.log('!undefined-list already included');
              res.jsonp('list already included');
            }else{
              collection.find({name:name},{lists:{$elemMatch:{shops:shopName}}}).toArray(function(err,userName){
                console.log(userName);
                if(userName[0].lists!=undefined){
                  console.log('!undefined-name taken, choose another');
                  res.jsonp('name taken, choose another');
                }else{
                  var ulist = {lid:alist.lid, shops:alist.shops}
                  collection.update({name:name},{$push:{lists:ulist}}, {upsert:false}, function(err, saved) {
                    if(err){res.jsonp(err)}else{
                      console.log('adding this list')
                      res.jsonp(ulist)};
                  });
                }
              });
            }                                      
          });
        });       
      }
    });
  });
});//PUT=Update
/*--------------------------------LIST routes----------------------------------------*/

app.get('/api/lists', function(req, res) {
    console.log('in findLists');
    myut.find(db, 'lists', res);
});
app.get('/api/lists/:lid', function(req,res){
  console.log('in getList by lid');
  console.log(req.params);
  var lid = req.params.lid;
  db.collection('lists', function(err, collection) {
    collection.findOne({lid:lid}, function(err, items) {
      if(err){res.jsonp(err)}else{res.jsonp(items)};
    })
  })
})
app.post('/api/lists/:shops', function(req,res){
  console.log('in createList w shops');
  console.log(req.params.shops);
  var shops = req.params.shops;
  var body= {lid: myut.createRandomWord(6), shops:shops, timestamp:Date.now()} 
  console.log(body);
  db.collection('lists', function(err, collection) {
      collection.insert(body, function(err, saved) {
          if(err){res.jsonp(err)}else{res.jsonp(saved)};
      });
  });  
})
app.del('/api/lists/:lid', function(req,res){
  console.log('in delete list by lid');
  console.log(req.params);
  var lid = req.params.lid;
  db.collection('lists', function(err, collection) {
    collection.remove({lid:lid}, function(err, saved) {
      if(err){res.jsonp(err)}else{res.jsonp(saved)};
    });
  });      
})
app.put('/api/lists/:lid', function(req,res){
  console.log('in update list/:lid');
  console.log(req.params);
  var body=req.body;
  var lid = req.params.lid;
  db.collection('lists', function(err, collection) {
    collection.update({lid:lid},{$set:body},function(err, items) {
      console.log(items);
      res.jsonp(items);
    });
  });
})

app.listen(3000);
console.log('listening on port 3000');
