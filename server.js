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

//ROUTES (eventually can refactor to be more modular)

//create new account
app.post('/user', (req, res) => {
  if(req.body.email){
    checkUser(req.body.email)
      .then(data => {
        if(data.count===0){
          createUser()
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
/*app.post('/user', (req, res) => {
  if(req.body.email){
    User.find({ email:req.body.email }, (err, users) => {
      if(err){
        res.status(500).send('Error querying the database: ' + err)
        return console.error(err);
      }
      if(users.length===0){
        var key = hat();
        var user = new User({ email: req.body.email, key: key});
        user.save((err,user) => {
          if (err) {
            res.status(500).send('Error creating a new account: ' + err)
          } else {
            //zapEmail(constants.zaps.signup, {email:user.email,key:user.key});
            sendEmail(constants.zaps.signup, {email:user.email,key:user.key})
              .then(data => {
                res.status(201).send('Created a new user account. You should get an email with your API key in the next few minutes')
              })
              .catch(err => {
                res.status(500).send('Error creating a new account: ' + err)
              })
          }
        })  
      } else {
        res.status(409).send('This email address is already associated with an account')
      }
    }); 
  } else {
  	res.status(202).send('No email address included in request, can\'t create account')
  }
})*/

//get existing account
app.get('/user', (req, res) => {
  if(req.query.email && req.query.key){
    User.find({ email:req.query.email }, (err, users) => {
      if(users.length===1){
        let user = Object.assign({}, users[0]._doc,{
          _id: 'REDACTED'
        });
        if(user.key===req.query.key){
          res.status(200).send(user);
        } else {
          res.status(400).send('api key doesn\'t match')
        }
      } else {
        res.status(400).send('No user with this email address')
      }
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

const checkUser = (email) => {
  return new Promise((resolve,reject)=>{
    User.find({ email : email }, (err, users) => {
      if (err){
        reject(err)
      } else {
        if (users.length===0){
          resolve({count:0,body:''})
        } else if (users.length===1){
          resolve({count:1,msg:users[0]})
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




