const User = require('../models/user.model');
const validate = require('../middleware/user/validation')
const bcrypt = require('bcryptjs')
const passport = require('passport')


exports.addUser = async function(req,res){
    let Fname = req.body.firstName
    let Lname = req.body.lastName
    let password = req.body.password
    let email = req.body.email
    let password2 = req.body.password2
    // console.log(password,email,password2)
    // console.log(typeof(password))
    
    const errorList = validate.validationTest(Fname,Lname,email,password,password2)

    //check whether user is already exit: 
    // const userNotExist = User.checkExist(email)
    // if (userNotExist == false){
    //     errorList.push({message:"email already registered"})
    // }

    if(validate.reportError(errorList)){
        //console.log("validation result:" + validate.reportError(errorList))
        //hash pasword
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password.toString(),salt,(err,hash)=>{
                if(err) throw err;
                password = hash;
                console.log(hash)
                console.log(password)
                try{
                    let result = User.addUser(Fname,Lname,email,password)
                    // 判别是否成功注册到数据库： 返回 201 ？ 不合适，因为 db 注册成功后本身不返回任何数据，返回数据的是 server发出的
                    if()
                    res.send(result)
                    res.status(201)
                    
                }catch(e){
                    res.send(e)
                }
            })
        })
        
        

    }else{
        res.send(errorList)
    }
}