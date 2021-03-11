const jwt = require('jsonwebtoken')

exports.patchToken = function(req,res,user){
    const token = req.get("auth-token")
    try{
        if(!token){
            res.status(401).send("not authorized")
            return "401"
        }else{
            let verified = jwt.verify(token,"randomString")
            // verified.id
            let isExist = false //check user db exist ?
            user.forEach(item=>{
                if(item.id){
                    isExist = true
                }
            })
            if(isExist === true){ //user exist ==> check match?
                if( verified.id && verified.id=== user[0].id){ //verified valid and match with db.id
                    return "200"
                }else{
                    res.status(403).send("doesn't match any user") // exist but not match
                    return "403"
                }
            }else{
                res.status(404).send("user not found")
                return "404"
            }
        }

    }catch (e) {
        console.log(e)
        res.status(500).send("Internal Server Error")
    }
}