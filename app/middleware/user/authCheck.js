const jwt = require("jsonwebtoken")

exports.auth = function(req,res){
    const token = req.get("X-Authorization")
    const id = req.params.id
    let authStatus = false
    try{
        if(token){
            let result = jwt.verify(token,"randomString") //{"id":123,"xxx":?}
            if(result.id && result.id === id){
                authStatus = true
            }
        }
        return authStatus
    }catch(e){
        console.log(e)
    }
}