express = require('express')
app = express()
port = process.env.PORT || 4000
mongoose = require('mongoose')
mongoose.Promise = Promise;
User = require('./model')
constants = require('./constants')
utils = require('./utils')
bodyParser = require('body-parser')
fetch = require('node-fetch');
hat = require('hat');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//initial connection to mongodb
const db_promise = mongoose.connect(constants.db.path, {
  useMongoClient: true,
});
db_promise.then(function(db) {
  //if you want to do some logging or checking when the DB is initialized?
});

//ROUTES 

//create new account
app.post('/user', (req, res) => {
  if(req.body.email){
    utils.checkUser(req.body.email)
      .then(data => {
        if(data.count===0){
          utils.createUser(req.body.email)
            .then(data =>{
              res.status(201).send('Created a new user account. You should get an email with your API key in the next few minutes :)')
            })
            .catch(err =>{
              res.status(500).send('Error creating a new account: ' + err)
            })
        } else {
          res.status(409).send('This email address is already associated with an account')
        }
      })
      .catch(err => {
        res.status(500).send('Error querying the database: ' + err)
      })
  } else {
    res.status(202).send('No email address included in request, can\'t create account')
  }
})

//gets existing account
app.get('/user', (req, res) => {
  if(req.query.email && req.query.key){
    utils.checkUser(req.query.email, req.query.key)
      .then(data =>{
        if(data.auth===true){
          res.status(200).send(data.body);
        }
      })
      .catch(err =>{
        res.status(400).send('API key doesn\'t match :(')
      })
  } else {
    res.status(409).send('Missing email or API key: please try logging in again')
  }
})

//reset API key
app.post('/reset', (req, res) => {
})

//push to zap trigger URL(s)
app.post('/push', (req, res) => {
})

//save changes to buttons
app.post('/save', (req, res) => {
})

//add zap trigger URL to button URL array
app.post('/register',  (req, res) => {

})

app.listen(port);
console.log('pushboard_server started on: ' + port);

//move these helper functions to a different file and import them later





