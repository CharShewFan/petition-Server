const User = require('../../controllers/user.server.controller')


exports.checkExites =async function(email,errorList){
    try{
        const result = await User.getDetails(email)
        //console.log("checkExites    " + result)
        if(result == email) {
            errorList.push("user already exists")
            return {"exists":true}
        }
        else{
            return {"exists":false}
        }
    }catch(e){
        console.log("checkExites" + e)
    }
}


/*-------------------------------------------------*/


exports.checkRgStatus = async function(email){
    try{
        const result =await User.getDetails(email)
        if (result == email){
            return true 
        }
        else{
            return false // add user failed
        }
    }catch(e){
        console.log("error from checkRgStatus:    "+ e)
    }  
}