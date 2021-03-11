const jwt = require('jsonwebtoken')


exports.auth = function(req,res,info){
    let token = req.get('auth-token')
    //console.log(token)
    try{
        if(token){
            let verified =  jwt.verify(token,"randomString")
            //console.log(verified.id)
            //console.log(info[0].id)

            let isExist = false
            info.forEach(item=>{
                if(item.id){
                    isExist = true
                }
            })
            if(isExist === true){
            if (verified.id && verified.id === info[0].id){
                res.status(200)
                res.send(
                    {
                        "id": info[0].id,
                        "email": info[0].email,
                        "firstName": info[0].first_name,
                        "lastName":info[0].last_name
                    }
                )
            }
        else{
            res.status(200)
            res.send(
                {
                    "id": info[0].id,
                    "firstName": info[0].first_name,
                    "lastName":info[0].last_name
                }
            )
        }
            }else{
                res.status(404)
                res.send("user not found")
            }
        }
    }catch (e) {
        res.status(500)
        res.send("Internal Server Error")
    }


}
