const User = require('../models/user.model');
// const validate = require('../middleware/user/validation')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const existence = require('../middleware/token/checkRg')
//const joi  = require('joi') 
const LoginValid = require('../middleware/validations/loginValidation')
const Register = require('../middleware/validations/registerValid');
const jwt = require('jsonwebtoken')
const verify = require('../middleware/token/verifyToken')
const verifyUpdate = require('../middleware/token/verifyTokenUpdate')
const patchValidate = require('../middleware/validations/patchValidation')
const patchToken = require('../middleware/token/patchToken')
//const fs = require('../middleware/HandleImage/fileHandle')
const imageHandler = require('../../storage/fileHandle')
const hash = require("../middleware/hashPassword")



/*retrieve users info with email address*/
exports.listUserDetails = async function(req,res){
    //console.log("list user detailed call")
    try{
        let [rows,fields] = await User.listUsers(req.body.email);
        res.status(200)
        res.send(rows[0])
        return rows
    }catch (e){
        res.status(400)
        res.send(e)
        //console.log(e)

    }
}

//create new user in db  with email,password,fname,lname ; expected response 201 or 400
exports.register = async function(req,res){
    let fname = req.body.firstName
    let lname = req.body.lastName
    let passwords = req.body.password
    let emails = req.body.email

    let validation = Register.registerValid({firstName:fname,lastName:lname,password:passwords,email:emails})
    //check whether user is already exit: //有 getDetail
     const repeatRg = existence.checkExist(emails).then(function(result){
         return result; //result.exists = true
        })

        
        // condition check : both validation and none existed in db
    if(validation.error || (await repeatRg).exists === true) {
        res.status(400)
        res.send("bad request")
    }else{
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(passwords.toString(),salt,(err,hash)=>{
                if(err) throw err;
                passwords = hash;
                try{
                    const promiseId =  User.addUser(fname,lname,emails,passwords).then((result)=>{
                        res.status(201)
                        res.json({"userId":result})
                    })
                }catch(e){
                    res.status(500)
                    res.send("internal server error: " + e)
                    
                }
            })
        })
    }
}

exports.rmUser = async function(req,res){
    return null;
}


//patch endpoint update user information
exports.updateUser = async function(req,res){
    try{
        //user data to find id
        const userInfo = await User.listUsersById(req.params.id)
        var isExist = false
        userInfo.forEach(item=>{
            if(item.id){
                isExist = true;
            }
        })

        if(isExist === true){
           let result = verifyUpdate.auth(req,res,userInfo) //判断是否授权用户
            if(result === true){

                //validate user input
                    const validated = patchValidate.patchValid(req.body)
                    console.log("validated")
                    console.log(validated)
                    if(validated === true){
                        /* update email */
                       if(req.body.email && req.body.email !== ""){
                           //check whether email repeated 
                           const emailCheck = await User.returnEmail(req.body.email)
                           if(emailCheck !== false){
                               res.status(400).send("band request")
                           }else{
                              let results =await User.updateUserInfo(["email",req.body.email,req.params.id])
                              res.status(200).send("successful")
                           }
                       }

                        /* update firstName */
                       if(req.body.firstName && req.body.firstName !== ""){
                           let result_2 = await User.updateUserInfo(["first_name",req.body.firstName,req.params.id])
                           res.status(200).send("successful")
                        }

                        /* update lastName */
                        if(req.body.lastName && req.body.lastName !== ""){
                            let result_3 = await User.updateUserInfo(["last_name",req.body.lastName,req.params.id])
                            res.status(200).send("successful")
                         }

                         /* update password */
                         if(req.body.password && req.body.password !== "" && req.body.currentPassword && req.body.currentPassword !== ""){

                             let params = [req.body.password,req.body.currentPassword]
                              let newPassword  = hash.hash(params[0])
                              let oldPassword = hash.hash(params[1])

                              const result_5 = User.retrivePassword(req,res)
                              if(result_5[0].password === oldPassword){
                                let result_6 = await User.updateUserInfo(["password",newPassword.toString(),req.params.id])
                                res.status(200).send("successful")
                              }else{
                                  res.status(400).send("bad request")
                              }
                         }
                            //update info
                           // await User.updateUserInfo(req.body)
                        }
                    }else{
                        res.status(401).send("unAuthorized user")
                    }
                }else{
                    res.status(404).send("user not found")
                }
        }catch(e)
        {
        console.log(e)
        }

}

/*login function generate token set it to db and header*/
exports.logIn = async function(req,res){
    // check validation of password / email
    let password = req.body.password
    let email = req.body.email
    
    
    let result = LoginValid.check({email:req.body.email,password:req.body.password})
    if(result.error){
        res.status(400).send("invalid email / password")
    }
    
    
    try{
        //check wether user exist
        let result1 = await  existence.checkExist(email)

        //user not register yet
        if( result1 === false) {
            res.status(400).send("email not exist")
        }else{
                //check password
                const userInfos = await User.listUsers(req.body.email)
                //const checkPassword = await bcrypt.compare(req.body.password,userInfo[0].password)
                if(password !== userInfos[0].password) {
                    res.status(400).send("password not valid")        
                }else{
                    /*create json web token*/
                    //let randomString = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
                    let token = jwt.sign({"id":userInfos[0].id},"randomString")
       
                    const results = await User.loginUser(token,req.body.email)
                    //console.log(result)
        
                    if (results) {
                    res.setHeader("X-Authorization",token)
                    res.status(200).send({"userId":results[0].id,"token":token})
                }
                }
            }


        
    }catch (e) {
        console.log(e)
        res.status(500)
    }
}

/*logout function delete token in db*/
exports.logOut = async function(req,res){
    try{

        let auth = req.header('X-Authorization')
        //console.log(typeof(auth))
        //console.log("isLogOut")
        //check token exist ? 
        if(auth === undefined || auth === "") {
            res.status(401).send("auth empty")
        }else{
            const status = await User.logOutUser(auth) //should return a boolean : whether user exist 
            if(status === true) {
                res.status(200).send('ok')}
            else {
                //doesnt match any user
                res.status(401).send('not authorized')
            }
        }
  


    }catch (e){
        res.status(500)
        res.send(e)
    }
}

/*get user info with/without token*/
exports.getDetails = async function(req,res){
    try{
        //console.log(req.header('X-Authorization')) 
        let token = req.header('X-Authorization')
        let id = req.params.id
        let userInfo = await User.listUsersById(id)
        let isExist = false
        userInfo.forEach(item=>{
            if(item.id){
                isExist = true
            }
        })

        if(isExist === false){
            res.status(404).send("user not found")
        }else{
            // console.log(token)
            // console.log(typeof(token))
            // console.log(userInfo[0].auth_token.trim())
            // console.log(typeof(userInfo[0].auth_token))
            if( token === undefined || token !== userInfo[0].auth_token.trim()){
                res.status(200).send({
                    "id": userInfo[0].id,
                    "first_name": userInfo[0].first_name,
                    "last_name":userInfo[0].last_name,
                    "image_filename":userInfo[0].image_filename
                })
            }else{
                res.status(200).send({
                    "id": userInfo[0].id,
                    "email":userInfo[0].email,
                    "first_name": userInfo[0].first_name,
                    "last_name":userInfo[0].last_name,
                    "image_filename":userInfo[0].image_filename
                })
            }
        }
    }catch (e) {
        console.log(e)
        res.status(500)
    }
}



