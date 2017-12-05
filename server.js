express = require('express')
app = express()
User = require('./model')
constants = require('./constants')
utils = require('./utils')
port = process.env.PORT || constants.port
mongoose = require('mongoose')
mongoose.Promise = Promise;
fetch = require('node-fetch');
hat = require('hat');
bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//initial connection to mongodb
const db_promise = mongoose.connect(constants.db.path, {
  useMongoClient: true,
});
db_promise.then(function(db) {
});

//ROUTES

//create new account
app.post('/user', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  utils.checkUser(req)
    .then(data => {
      if(data.count===0){
        utils.createUser(req.body.email)
          .then(data => res.status(201).send('Created a new user account. You should get an email with your API key in the next few minutes :)'))
          .catch(err => res.status(500).send('Error creating a new account: ' + err))
      } else {
        res.status(409).send('This email address is already associated with an account')
      }
    })
    .catch(err => res.status(400).send('Error validating user account: ' + err))
})

//get existing account
app.get('/user', (req, res) => {
  console.log(req.headers);
  res.setHeader('Access-Control-Allow-Origin', '*');
  req.body = req.query
  utils.checkUser(req)
    .then(data =>{
      if(data.auth===true){
        res.status(200).send(data.body);
      } else {
        res.status(400).send('Missing or invalid API key')
      }
    })
    .catch(err => res.status(400).send('Error validating user account: ' + err))
})

//reset API key
app.post('/reset', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  utils.checkUser(req)
    .then(data =>{
      if(data.count===1){
        utils.resetKey(req.body.email)
          .then(data => res.status(200).send("Reset your API key. You should get an email containing it in the next few minutes :)"))
          .catch(err => res.status(500).send("Error resetting your API key: " + err))
      } else if (data.count===0){
        res.status(400).send('No account with that email address')
      }
    })
    .catch(err => res.status(400).send('Error validating user account: ' + err))
})

//push to zap trigger URL(s)
app.post('/push', (req, res) => {
  utils.checkUser(req)
    .then(data =>{
      let button = JSON.parse(req.body.button);
      utils.push(data.body.buttons[button.id].hookURL, button)
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send('Error sending the push requests: ' + err))
    })
    .catch(err => res.status(400).send('Error validating user account: ' + err))  
})

//save changes to buttons
app.post('/save', (req, res) => {
  utils.checkUser(req)
    .then(data =>{
      if(data.auth===true){
        let updater = JSON.parse(req.body.button);
        utils.updateButton(req.body.email, data.body.buttons, updater)
          .then(data => res.status(200).send("Updated buttons in database"))
          .catch(err => res.status(500).send("Error updating the database: " + err))
      } else {
        res.status(400).send('Your API key doesn\'t match :(')
      }
    })
    .catch(err => res.status(400).send('Error validating user account: ' + err)) 
})

//register zap trigger URLs for pushing
app.post('/register',  (req, res) => {

})

//remove zap trigger URLs if Zap is deleted/turned off
app.post('/delete',  (req, res) => {

})

app.listen(port);
console.log('pushboard_server started on: ' + port);






