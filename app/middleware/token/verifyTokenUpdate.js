const jwt = require('jsonwebtoken')

exports.auth = function(req,res){
    let token = req.get('X-Authorization')
    let authUser = false
    try{
        if(token){
            try{         
                var verified =  jwt.verify(token,"randomString")
        }catch(e){
            console(e)
        }
    }
          
            //check authen of user by comparing params.id === token.id === db.id
        if (verified.id && verified.id === info[0].id === req.params.id){
                    return authUser = true
        }else
            {
                return authUser
            }
    }catch(e){
            res.status(500).send("Interal Server Error")
    }
}
