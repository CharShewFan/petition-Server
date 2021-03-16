const jwt = require('jsonwebtoken')

exports.auth = function(req,res){
    let token = req.get('auth-token')
    let authUser = false
    try{
        if(token){
            let verified =  jwt.verify(token,"randomString")
          
            //check user existence
            let isExist = false  
            info.forEach(item=>{
                if(item.id){
                    isExist = true
                }
            })
            if(isExist === true){
            //check authen of user by comparing params.id === token.id === db.id
            if (verified.id && verified.id === info[0].id === req.params.id){
                authUser = true
            }

            }
        }
        return authUser
    }catch(e){
            res.status(500).send("Interal Server Error")
        }
}