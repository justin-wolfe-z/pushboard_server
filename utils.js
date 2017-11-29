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

const checkUser = (email, key) => {
  return new Promise((resolve,reject)=>{
    User.find({ email : email }, (err, users) => {
      if (err){
        reject(err)
      } else {
        if (users.length===0){
          resolve({count:0, auth: false, body:''})
        } else if (users.length===1){
          if(key){
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
        resolve(raw)
      }
    })
  })
}

//create array of promises to resolve with promise all
const createPushArray = (button) => {
  console.log('createPushArray')
  let promiseArr = [];
  for(let hook of button.hookURL){
    promiseArr.push(createPushPromise(button,hook))
  }
  return promiseArr
}

//create the individual promises to go in that array
const createPushPromise = (button,URL) => {
  return new Promise((resolve,reject)=>{
    fetch(URL, { method: 'POST', headers: constants.headers, body: JSON.stringify(button)})
      .then((res) => {
        return res.json();
      }).then((json) => {
        resolve(json);
      }).catch((err) => {
        reject(err);
      })    
  })
}

//push all the promises
const push = (promiseArr) => {
  Promise.all(promiseArr)
    .then(data => {
      resolve(data)
    })
    .catch(err =>{
      reject(err)
    })
}

module.exports = {
  sendEmail,
  checkUser,
  createUser,
  updateUser,
  updateButton,
  createPushPromise,
  createPushArray,
  push
}
