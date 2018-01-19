hat = require('hat')
atob = require('atob')

const sendEmail = (zapURL, message) => {
  return new Promise((resolve, reject)=>{
      fetch(zapURL, { method: 'POST', headers: constants.headers, body: JSON.stringify(message)})
      .then((res) => {
        return res.json();
      }).then((json) => {
        resolve(json);
      }).catch((err) => {
        reject(err);
      })
  });
}

const createUser = (email) => {
  return new Promise((resolve,reject)=>{
    var key = hat();
    var user = new User({ email: email, key: key});
    user.save((err,user) => {
      if (err) {
        reject(err)
      } else {
        sendEmail(constants.zaps.email, {email:user.email,text:constants.emails.signup,key:user.key,created: new Date()})
          .then(data => {
            resolve(user)
          })
          .catch(err => {
            reject(err)
          })
      }
    })      
  })  
}

const updateButton = (email,buttons,updater) => {
  return new Promise((resolve,reject)=>{
    let query = {email: email}
    let matchingButtonIndex = buttons.findIndex(function (obj) { return obj.id === updater.id; });
    let updatedButton = Object.assign({}, buttons[matchingButtonIndex],{
      icon: updater.icon,
      type: updater.type,
      text: updater.text
    })
    buttons[matchingButtonIndex] = updatedButton
    let update = {buttons: buttons}   
    updateUser(query,update)
      .then(data => {
        resolve(buttons)
      })
      .catch(err => {
        reject(err)
      })
  })
}

const updateUser = (query, update) => {
  return new Promise((resolve,reject)=>{
    User.update(query,update, (err, raw) => {
      if(err) {
        reject(err)
      } else {
        raw.query = query
        raw.update = update
        resolve(raw)
      }
    })
  })
}

const resetKey = (email) => {
  return new Promise((resolve,reject)=>{
    let newKey = hat()
    let query = {email:email}
    let update = {key:newKey}
    utils.updateUser(query,update)
      .then(data => {
        sendEmail(constants.zaps.email, {email:data.query.email,text:constants.emails.reset,key:data.update.key})
          .then(data => resolve(data))
          .catch(err => reject(err))           
      })
      .catch(err => {
        reject(err)
      })
  })
}

const push = (linkArr,button) => {
  return new Promise((resolve,reject)=>{
    Promise.all(linkArr.map((link) => 
      fetch(link, { method: 'POST', headers: constants.headers, body: JSON.stringify(button)})
        .then(response => {
          return response.json()
        }).then(json => {
          json.link = link
          return json
        }).catch(err => {
          return err
        })
    ))
    .then(results => {
      resolve(results)
    })
    .catch(err => {
      reject(err)
    })
  })
}

const manageHooks = (action, zapier, user) => {
  return new Promise((resolve,reject)=>{
    let query = {email: user.email}
    let buttons = user.body.buttons
    let index = buttons.findIndex(function (obj) { return obj.id === parseInt(zapier.button)});
    let currentHookArr = buttons[index].hookURL
    if(action==='subscribe'){
      currentHookArr.push(zapier.target_url) 
    } else if (action==='unsubscribe'){
      for(var i=0; i<currentHookArr.length; i++){
        if(currentHookArr[i] === zapier.target_url){
          currentHookArr.splice(i,1)
        }
      }
    }
    let update = {buttons: buttons}          
    updateUser(query,update)
      .then(data => {
        resolve()
      })
      .catch(err => {
        reject(err)
      })
  })
}

//from https://gist.github.com/cuppster/2344435
const allowCrossDomainMiddle = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://somedrafts.com/*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); 
    res.header('Access-Control-Max-Age', 1000); 
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.status(200).send();
    }
    else {
      next();
    }
}

const logger = function(req, res, next) {
  console.log(req.method)
  console.log(req.headers)
  console.log(req.data)
  next()
}

const checkUserMiddle = (req,res,next) => {
  if(req.headers.authorization){
    let headerArr = req.headers.authorization.split(' ')
    let authArr = atob(headerArr[1]).split(':')
    let email = authArr[0]
    let key = authArr[1]
    User.find({ email : email }, (err, users) => {
      if (err){res.status(500).send({'status':'error','message':'Error accessing the database: ' + err + "'"})
      } else {
        if (users.length===0){
          req.checked = {count:0, auth: false, body:'', email: email}
          next()
        } else if (users.length===1){
          if(key){
            let user = Object.assign({}, users[0]._doc,{
              _id: 'REDACTED'
            });
            if(user.key===key){
              req.checked = {count:1, auth:true, body:user, email: email}
              next()
            } else {
              res.status(400).send({'status':'error','message':"The API key you entered doesn't match the database"})
            }            
          } else {
            req.checked = {count:1, auth:false, email: email}
            next()
          }
        }
      }
    })
  } else {
    res.status(400).send("Authorization header not included")
  }
}

module.exports = {
  sendEmail,
  createUser,
  updateUser,
  updateButton,
  resetKey,
  push,
  allowCrossDomainMiddle,
  checkUserMiddle,
  manageHooks,
  logger
}
