const User = require('../models/user.model');
const validate = require('../middleware/user/validation')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const existence = require('../middleware/user/checkRg')
const joi  = require('joi')
const LoginValid = require('../middleware/validations/loginValidation')
const Register = require('../middleware/validations/registerValid');
const { func } = require('joi');


//retrieve all users data with eamil
exports.listUserDetails = async function(req,res){
    console.log("user controller call")
    try{
        let user_detail = await User.listUsers(req.body.email);
        res.status(200)
        res.send(user_detail)
    }catch (e){
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
exports.login =  function(req,res){
    const hashedPassword = req.body.password
    const sql = `SELECT email , id WHERE email = ${req.body.email} and password = ${hashedPassword}`
    const validation = LoginValid.loginValid({email:req.body.email,password:hashedPassword})
    //console.log(validation.error)
    if(validation.error) return res.status(400) .send(validation.error.details[0].message)

}
