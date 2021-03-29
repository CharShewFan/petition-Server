const User = require('../../models/user.model')


/*check whether user email was registered*/
exports.checkExist = async function(email){
    try{
        const result = await User.returnEmail(email)

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
