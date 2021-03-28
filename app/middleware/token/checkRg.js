const User = require('../../models/user.model')


/*check whether user email was registered*/
exports.checkExist = async function(email){
    try{
        const result = await User.returnEmail(email)
        //console.log("result from checkExist")
       // console.log(result)
        if (result === false){
            return {"exists":false}
        }
        if(result === email) {
            
            return {"exists":true}
        }
    }catch(e){
        console.log("checkExist" + e)
    }
}


/*-------------------------------------------------*/
