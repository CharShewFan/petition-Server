const bcrypt = require("bcryptjs")


exports.hash = function (password) {
    try{
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password.toString(),salt,(err,hash)=>{
                if(err) throw err;
                return password = hash;
            })
        })
    }
    catch(e){
        console.log(e)
    }

}