const User = require('../../models/user.model')


/*check whether user email was registered*/
exports.checkExist = function(email){
    try{
        const result = User.returnEmail(email)

       let isExist = false
       result.forEach(item=>{
           if(item.email){
               isExist = true
           }
       })
       
       return isExist
    }catch(e){
        console.log("checkExist" + e)
    }
}


/*-------------------------------------------------*/
