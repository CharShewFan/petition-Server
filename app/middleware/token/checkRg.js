const User = require('../../models/user.model')


/*check whether user email was registered*/
exports.checkExist = async function(email){
    try{
        const result = await User.returnEmail(email)

       let isExist = true
       if(result == null){
           isExist = false
       }
       
       return isExist
    }catch(e){
        console.log("checkExist" + e)
    }
}


/*-------------------------------------------------*/
