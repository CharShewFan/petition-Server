const User = require('../models/user.model');
const validate = require('../middleware/user/validation')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const existence = require('../middleware/user/checkRg')
const joi  = require('joi')
const LoginValid = require('../middleware/validations/loginValidation')


//retrieve all users data with eamil
exports.listUserDetails = async function(req,res){
    console.log("user constroller call")
    try{
        let user_detail = await User.listUsers(req.body.email);
        res.status(200)
        res.send(user_detail)
    }catch (e){
        res.send(e)
        console.log(e)

    }
}

/* two case to get user details : 
1,user already login in ,use autn_token to auth request
*/
exports.getDetails = async function(email){
    try{
        const [object] = await User.listUsers(email) //use await to unfold promise obj
        console.log(object[0].email)
        //let showObj = object[0]
        //let email = object[index].email
        //console.log(showObj)
       // console.log("check getDetails " + object[0].email) //object[0].email = "33334d987@gmail.com"
       // console.log(typeof(object[0].email)) string
        return object[0].email
        
   }catch(e){
       console.log("getDetail:   "+ e)
   }
}



exports.addUser = async function(req,res){
    let Fname = req.body.firstName
    let Lname = req.body.lastName
    let password = req.body.password
    let email = req.body.email
    let password2 = req.body.password2
    let errorList = validate.validationTest(Fname,Lname,email,password,password2)//return a error type:[]

    //check whether user is already exit: //有 getDetail
     const repeatRg = existence.checkExites(email,errorList).then(function(result){ 
         return result; //result.exists = true
     })

    //console.log(errorList)

    if(validate.reportError(errorList) === true && (await repeatRg).exists === false) {
        //console.log("validation result:" + validate.reportError(errorList))
        //hash password
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password.toString(),salt,(err,hash)=>{
                if(err) throw err;
                password = hash;
                console.log(hash)
                console.log(password)
                try{
                    User.addUser(Fname,Lname,email,password)
                    //check add user status and return info of new user 
                    // if(existence.checkRgStatus(email) == true){
                    //     console.log("add user ")
                    //let  user_detail = User.listUsers(email).then(function(userInfo){
                        // return userInfo
                       //  });
                    res.status(201)
                    res.send("hello world")

                    // }
                    //res.send(result)
                    
                }catch(e){
                    res.send(e)
                }
            })
        })
    }else{
        res.send(errorList)
    }
}

exports.rmUser = async function(req,res){
    return null;
}

exports.updateUser = async function(req,res){
    return null;
}


/*login function*/
exports.login =  function(req,res){
    const hashedPassword = req.body.password
    const sql = `SELECT email , id WHERE email = ${req.body.email} and password = ${hashedPassword}`
    const validation = LoginValid.loginValid({email:req.body.email,password:hashedPassword})
    //console.log(validation.error)
    if(validation.error) return res.status(400) .send(validation.error.details[0].message)

}
