express = require('express')
app = express()
port = process.env.PORT || 4000
mongoose = require('mongoose')
mongoose.Promise = Promise;
User = require('./model')
bodyParser = require('body-parser')
fetch = require('node-fetch');
hat = require('hat');
util = require('util')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//move these to another file later
const constants = {
  db:{
    path: 'mongodb://localhost/myapp'
  },
  zaps:{
    signup: 'https://hooks.zapier.com/hooks/catch/2003878/ssrlnv/',
    delete: '', 
    reset: ''  
  },
  headers: {'Content-Type':'application/json'}
}

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
    checkUser(req.body.email)
      .then(data => {
        if(data.count===0){
          createUser(req.body.email)
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
    checkUser(req.query.email, req.query.key)
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
const sendEmail = (zapURL, userInfo) => {
  return new Promise((resolve, reject)=>{
      fetch(zapURL, { method: 'POST', headers: constants.headers, body: JSON.stringify(userInfo) })
      .then((res) => {
        return res.json();
      }).then((json) => {
        resolve(json);
      }).catch((err) => {
        reject(err);
      })
  });
}

const checkUser = (email,key) => {
  return new Promise((resolve,reject)=>{
    User.find({ email : email }, (err, users) => {
      if (err){
        reject(err)
      } else {
        if (users.length===0){
          resolve({count:0,body:''})
        } else if (users.length===1){
          if(key){
            let user = Object.assign({}, users[0]._doc,{
              _id: 'REDACTED'
            });
            if(user.key===key){
              resolve({count:1,auth:true,body:user})
            } else {
              reject('The API key you entered doesn\'t match')
            }            
          } else {
            resolve({count:1,auth:false})
          }
        }
      }
    })
  })
}

const createUser = (email) => {
  return new Promise((resolve,reject)=>{
    var key = hat();
    var user = new User({ email: email, key: key});
    user.save((err,user) => {
      if (err) {
        reject(err)
      } else {
        sendEmail(constants.zaps.signup, {email:user.email,key:user.key})
          .then(data => {
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      }
    })      
  })  
}




