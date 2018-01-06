//imports 
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

//application level middleware
app.use(utils.logger);
//app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//allowCrossDomainMiddle is middleware that handles cross-domain requests (including the preflight request)
app.use(utils.allowCrossDomainMiddle)
//checkUserMiddle is middleware set up to check creds in Authorization header 
//and return a "checked" object on the request going into the route handler
//which is used to determine user status for the actions of the route handler
app.use(utils.checkUserMiddle)

//initial connection to mongodb
const db_promise = mongoose.connect(constants.db.path, {});
db_promise.then(function(db) {
});

//ROUTES
//create new account
app.post('/user', (req, res) => {
  if(req.checked.count===0){
      utils.createUser(req.checked.email)
        .then(data => res.status(201).send({'status':'new','body':data,'message':'Created a new user account. You should get an email with your API key in the next few minutes :)'}))
        .catch(err => res.status(500).send({'status':'error','message':'Error creating a new account: ' + err + "'"}))
  } else {
    res.status(409).send({'status':'error','message':'This email address is already associated with an account.'})
  }
})

//get existing account
app.get('/user', (req, res) => {
  if(req.checked.auth===true){
    res.status(200).send({'status':'existing','body':req.checked.body})
  } else {
    res.status(400).send({'status':'error','message':'Your API key doesn\'t match :('})
  }
})

//reset API key
app.post('/reset', (req, res) => {
  if(req.checked.count===1){
    utils.resetKey(req.checked.email)
      .then(data => res.status(200).send("Reset your API key. You should get an email containing it in the next few minutes :)"))
      .catch(err => res.status(500).send("Error resetting your API key: " + err))
  } else if (req.checked.count===0){
    res.status(400).send('No account with that email address')
  }
})

//push to zap trigger URL(s)
app.post('/push', (req, res) => {
  let button = req.body
  utils.push(req.checked.body.buttons[button.id].hookURL, button)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send('Error sending the push requests: ' + err))
})

//save changes to buttons
app.post('/save', (req, res) => {
  if(req.checked.auth===true){
    let updater = req.body;
    utils.updateButton(req.checked.email, req.checked.body.buttons, updater)
      .then(data => res.status(200).send({"status":"updated","message":"Updated button in database",body:data}))
      .catch(err => res.status(500).send({"status":"error","message":"Error updating the database: " + err}))
  } else {
    res.status(400).send('Your API key doesn\'t match :(')
  }
})

//register zap trigger URLs for pushing
app.post('/subscribe',  (req, res) => {
  if(req.checked.auth===true){
    utils.manageHooks('subscribe',req.body,req.checked)
      .then(data => res.status(201).send())
      .catch(err => res.status(500).send("Error updating the database: " + err))
  } else {
    res.status(400).send('Your API key doesn\'t match :(')
  }
})

//remove zap trigger URLs if Zap is deleted/turned off
app.post('/unsubscribe',  (req, res) => {
  if(req.checked.auth===true){
    utils.manageHooks('unsubscribe',req.body,req.checked)
      .then(data => res.status(200).send())
      .catch(err => res.status(500).send("Error updating the database: " + err))
  } else {
    res.status(400).send('Your API key doesn\'t match :(')
  }
})

app.listen(port);
console.log('pushboard_server started on: ' + port);






