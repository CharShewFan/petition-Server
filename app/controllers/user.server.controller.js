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
const userFormater = require("../middleware/formater/user")
const build = require('../middleware/buildSQL')


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
     const isExist = await existence.checkExist(emails)

        
        // condition check : both validation and none existed in db
    if(validation.error || isExist === true) {
        res.status(400)
        res.send("bad request")
    }else{ // vali pass and not existed user
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
        console.log("controller called")
        let token = req.get("X-Authorization")
        let id  = req.params.id
        let newEmail = req.body.email
        let newPassword = req.body.password
        let oldPassword = req.body.currentPassword
    
        let userExist = false
        let userInfo = await User.listUsersById(id)
        let dbTokenExist = false
    
        userInfo.forEach(item=>{
            if(item.email){
                userExist = true
            }
        })
    
        //repeat email , unvalied data 
        if(newEmail){
            const emailCheck = await User.returnEmail(newEmail)
            if(emailCheck[0] !== undefined )
            {
                if(emailCheck[0].id !== undefined){
                    res.status(400).send("email been taken")
                }
                
            } 
        }
    
    
        // first , check data validation
        const pass = patchValidate.patchValid(req.body)
        if(pass === false){
            res.status(400).send("wrong request")
        }
    
        //check user wether exist with id
        if(userExist === false){
            res.status(404).send("not found")
        }
    
        // the id user is auth but may not same with client token
        if(userInfo[0].auth_token !== null){
            dbTokenExist = true
        }
    
        if(dbTokenExist === false){
            res.status(401).send("un auth user")
        }
        console.log(dbTokenExist)
    
        //no token ,no auth
        if(token == undefined || token == null){
            res.status(401).send("un auth user")
        }
    
        // token !== db.token 403
        if(userInfo[0].auth_token !== token){
            res.status(403).send("userInfo[0].auth_token !== toke")
        }
    
    
    
    
        // patch to db
        const sql = build.userPatch(req.body,id)
        const result = await User.updateUserInfo(sql)
        if(result === true){
            res.status(200).send("ok")
        }else{
            res.status(500).send("internal error")
        }
    }catch(e){
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
        let token = req.get('X-Authorization')
        let id = req.params.id
        let userInfo = await User.listUsersById(id)
        let isExist = false
        userInfo.forEach(item=>{
            if(item.email){
                isExist = true
            }
        })

        if(isExist === false){
            res.status(404).send("user not found")
        }else{ 
            //user exist
            if(token === undefined || token === null){
                res.status(200).send({
                    "firstName": userInfo[0].first_name,
                    "lastName":userInfo[0].last_name
                })
            }else{
                //header token exist
                let dbToken = userInfo[0].auth_token
                if(dbToken !== null ){
                    
                    if(token === dbToken){ //auth user
                        res.status(200).send({
                            "firstName": userInfo[0].first_name,
                            "lastName":userInfo[0].last_name,
                            "email":userInfo[0].email
                        })
                    }else{ //not correct token
                        res.status(200).send({
                            "firstName": userInfo[0].first_name,
                            "lastName":userInfo[0].last_name
                           
                        })
                    }
                }else{ // db token = null
                    res.status(200).send({
                        "firstName": userInfo[0].first_name,
                        "lastName":userInfo[0].last_name
                    })
                }
            }



        }
    }catch (e) {
        console.log(e)
        res.status(500)
    }
}



