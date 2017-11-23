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
  /* other options */
});
db_promise.then(function(db) {
});

//routes (eventually can refactor to be more modular)
app.get('/signup', function (req, res) {
	console.log(req.query);
  res.send('GET request to /signup')
})

app.post('/signup', function (req, res) {
	console.log(req.body);
  if(req.body.email){
  	res.send('Email address')
  } else {
  	res.send('No email address')
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
