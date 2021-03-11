const User = require('../models/user.model');
const validate = require('../middleware/user/validation')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const existence = require('../middleware/user/checkRg')
const joi  = require('joi')
const LoginValid = require('../middleware/validations/loginValidation')
const Register = require('../middleware/validations/registerValid');
const jwt = require('jsonwebtoken')
const verify = require('../../app/verifyToken')

//retrieve all users data with email
exports.listUserDetails = async function(req,res){
    console.log("list user detailed call")
    try{
        let [rows,fields] = await User.listUsers(req.body.email);
        res.status(200)
        res.send(rows[0])
        return rows
    }catch (e){
        res.status(400)
        res.send(e)
        console.log(e)

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
                        res.send(result.toString())
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

exports.updateUser = async function(req,res){
    return null;
}


/*login function*/
exports.logIn = async function(req,res){
    try{
        const validation = LoginValid.loginValid({email:req.body.email,password:req.body.password})
        if(validation.error)  res.status(400).send(validation.error.details[0].message)

        const repeatRg = await existence.checkExist(req.body.email).then(function(result){
            return (result) ; //result.exists = true
        })
        console.log(repeatRg.exists)
        if( repeatRg.exists === false) res.status(400).send("email not exist")

        const userInfo = await User.listUsers(req.body.email)
        console.log("dbPassword")
        console.log(userInfo[0].password)

        const checkPassword = await bcrypt.compare(req.body.password,userInfo[0].password)
        console.log(checkPassword)
        if(!checkPassword)  res.status(400).send("password not valid")

        /*create json web token*/
        //let randomString = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        let token = jwt.sign({"id":userInfo[0].id},"randomString")
        res.setHeader("auth-token",token)
        const result = await User.loginUser(token,req.body.email)
        console.log(result)
        if (result) res.status(200).send({"id":result[0].id.toString(),"token":token})
    }catch (e) {
        console.log(e)
    }
}

exports.logOut = async function(req,res){
    //console.log(req.header('X-Authorization'))
    try{
        const isLogOut = await User.logOutUser(req.header('X-Authorization'))
        if(isLogOut === true) {
            res.status(200).send('ok')}
        else {
            res.status(401).send('not authorized')
        }
    }catch (e){
        res.status(500)
        res.send(e)
    }
}


exports.getDetails = async function(req,res){
    try{
        let token = req.header('auth-token')
        //console.log(token)
        const user = await User.listUsersById({"id":req.params.id})
        verify.auth(req,res,user)
        //console.log("verified.id: (next row)")
    }catch (e) {
        console.log(e)
    }
}


