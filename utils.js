hat = require('hat');

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

const checkUser = (req) => {
  return new Promise((resolve,reject)=>{
    if(req.body.email){
      let email = req.body.email
      User.find({ email : email }, (err, users) => {
        if (err){
          reject(err)
        } else {
          if (users.length===0){
            resolve({count:0, auth: false, body:''})
          } else if (users.length===1){
            if(req.body.key){
              let key = req.body.key
              let user = Object.assign({}, users[0]._doc,{
                _id: 'REDACTED'
              });
              if(user.key===key){
                resolve({count:1, auth:true, body:user})
              } else {
                reject('The API key you entered doesn\'t match')
              }            
            } else {
              resolve({count:1, auth:false})
            }
          }
        }
      })
    } else {
      reject('You didn\'t include an email address')
    }
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
        sendEmail(constants.zaps.email, {email:user.email,text:constants.emails.signup,key:user.key})
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

const updateButton = (email,buttons,updater) => {
  return new Promise((resolve,reject)=>{
    let query = {email: email}
    let updatedButton = Object.assign({}, buttons[updater.id],{
      icon: updater.icon,
      type: updater.type,
      text: updater.text
    })
    buttons[updater.id] = updatedButton
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

module.exports = {
  sendEmail,
  checkUser,
  createUser,
  updateUser,
  updateButton,
  resetKey,
  push
}
