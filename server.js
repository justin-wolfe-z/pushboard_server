express = require('express')
app = express()
port = process.env.PORT || 4000
mongoose = require('mongoose')
mongoose.Promise = Promise;
User = require('./model')
bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/*mongoose.connect('mongodb://localhost/')*/

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
        var user = new User({ email: req.body.email });
        user.save(function (err) {
          if (err) {
            console.log(err);
          } else {
            res.status(201).send("Created a new user account")
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

console.log('ooo RESTful API server started on: ' + port);
