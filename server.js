express = require('express')
app = express()
port = process.env.PORT || 4000
mongoose = require('mongoose')
mongoose.Promise = Promise;
User = require('./model')
bodyParser = require('body-parser')
fetch = require("node-fetch");
hat = require('hat');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const constants = {
  signupZap: 'https://hooks.zapier.com/hooks/catch/2003878/ssrlnv/'
}

const db_promise = mongoose.connect('mongodb://localhost/myapp', {
  useMongoClient: true,
});
db_promise.then(function(db) {
  /*User.find(function (err, users) {
    if (err) return console.error(err);
    console.log("this is users that matched:")
    console.log(users);
  })*/
});

//routes (eventually can refactor to be more modular)
app.get('/signup', function (req, res) {
  res.send('GET request to /signup')
})

app.post('/signup', function (req, res) {
  if(req.body.email){
    User.find({ email:req.body.email }, function(err, users){
      if(err) return console.error(err);
      if(users.length===0){
        var user = new User({ email: req.body.email, key: hat()});
        user.save(function (err,user) {
          if (err) {
          } else {
            res.status(201).send("Created a new user account")
            sendSignupEmail({email:user.email,key:user.key});
          }
        })  
      } else {
        res.status(409).send("This email address already has an account")
      }
    }); 
  } else {
  	res.status(202).send('No email address')
  }
})

app.get('/login', function (req, res) {
  res.send('GET request to /login')
})

app.post('/login', function (req, res) {
  res.send('POST request to /login')
})

app.get('/save', function (req, res) {
  res.send('GET request to /save')
})

app.post('/save', function (req, res) {
  res.send('POST request to /save')
})

app.listen(port);

//helper functions (put these in another file and import them later)

function sendSignupEmail(userInfo){
  fetch(constants.signupZap, { method: 'POST', headers:{'Content-Type':'application/json'},body: JSON.stringify(userInfo) })
      .then(function(res) {
          return res.json();
      }).then(function(json) {
          console.log(json);
      });
}

console.log('ooo RESTful API server started on: ' + port);
