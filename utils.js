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

const updateUser = (id,type,fields) => {
  return new Promise((resolve,reject)=>{

  })
}

module.exports = {
  sendEmail,
  checkUser,
  createUser,
  updateUser
}
