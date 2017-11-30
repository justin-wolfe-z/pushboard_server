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
  //if you want to do some logging or checking when the DB is initialized?
});

//ROUTES 

//TODO : move logic for req param presence from routes into checkUser util (just pass it the req object)
//can also do this for the data.count logic perhaps? though that's a bittrickier

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
        res.status(400).send('Your API key doesn\'t match :(')
      })
  } else {
    res.status(409).send('Missing email or API key: please try logging in again')
  }
})

//reset API key
app.post('/reset', (req, res) => {
  if(req.body.email){
    utils.checkUser(req.body.email)
      .then(data =>{
        if(data.count===1){
          let newKey = hat()
          let query = {email:req.body.email}
          let update = {key:newKey}
          utils.updateUser(query,update)
            .then(data => {
              utils.sendEmail(constants.zaps.signup, {email:req.body.email,key:newKey})
                .then(data => {
                  res.status(200).send('Reset your API key. You should get an email with your API key in the next few minutes :)')
                })
                .catch(err => {
                  res.status(500).send('Error sending an email with your new API key: ' + err)
                })             
            })
            .catch(err => {
              res.status(500).send('Error updating the database: ' + err)
            })
        } else if (data.count===0){
          res.status(400).send('No account with that email address')
        }
      })
      .catch(err =>{
        res.status(500).send('Error querying the database: ' + err)
      })
  } else {
    res.status(409).send('Missing email or API key: please try logging in again')
  }  
})

//push to zap trigger URL(s)
//can use Promise.all for this?
app.post('/push', (req, res) => {
  if(req.body.email && req.body.key && req.body.button){
    utils.checkUser(req.body.email,req.body.key)
      .then(data =>{
        var button = JSON.parse(req.body.button);
        Promise.all(data.body.buttons[button.id].hookURL.map((link) => 
          fetch(link, { method: 'POST', headers: constants.headers, body: JSON.stringify({"id":"test"})})
            .then(response => {
              return response.json()
            }).then(json => {
              console.log(json)
              return json
            }).catch(err => {
              return err
            })
        ))
        .then(results => {
          console.log(results)
          res.status(200).send(results)
        })
      })
      .catch(err =>{
        res.status(500).send('Error querying the database: ' + err)
      })  
  } else {
    res.status(409).send('Missing email or API key or button update: please try again')
  }
})

//save changes to buttons
app.post('/save', (req, res) => {
  if(req.body.email && req.body.key && req.body.button){
    utils.checkUser(req.body.email,req.body.key)
      .then(data =>{
        if(data.auth===true){
          let updater = JSON.parse(req.body.button);
          utils.updateButton(req.body.email, data.body.buttons, updater)
            .then(data =>{
              res.status(200).send("Updated buttons in database")
            })
            .catch(err =>{
              res.status(500).send("Error updating the database: " + err)
            })
        } else {
          res.status(400).send('Your API key doesn\'t match :(')
        }
      })
      .catch(err =>{
        res.status(500).send('Error querying the database: ' + err)
      })
  } else {
    res.status(409).send('Missing email or API key or button update: please try again')
  }  
})

//register zap trigger URLs for pushing
//will need CLI app to test but can start based on docs
app.post('/register',  (req, res) => {

})

app.listen(port);
console.log('pushboard_server started on: ' + port);






