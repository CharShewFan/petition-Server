const User = require('../models/user.model');
// const validate = require('../middleware/user/validation')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const existence = require('../middleware/user/checkRg')
//const joi  = require('joi') 
const LoginValid = require('../middleware/validations/loginValidation')
const Register = require('../middleware/validations/registerValid');
const jwt = require('jsonwebtoken')
const verify = require('../middleware/user/verifyToken')
const verifyUpgrade = require('../middleware/user/verifyTokenUpgrade')
const patchValidate = require('../middleware/validations/patchValidation')
const patchToken = require('../middleware/user/patchToken')
//const fs = require('../middleware/HandleImage/fileHandle')
const imageHandler = require('../../storage/fileHandle')



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

exports.updateUser = async function(req,res){
    try{
        // query db to request id from user and match
        //after check and match query update to db
        //only update query with "200" return from ignory other case

        //user data to find id
        const user = await User.listUsersById(req.params)
        //validate user input
        const validated = patchValidate.patchValid(req.body)
        console.log("validated")
        console.log(validated)
        if(validated === true){
            const statusCode = patchToken(req,res,user)
            if(statusCode === "200"){
                //update info
                await User.updateUserInfo(req.body)
            }
        }
    }catch(e){
        console.log(e)
    }

}

/*login function generate token set it to db and header*/
exports.logIn = async function(req,res){
    try{
        const validation = LoginValid.loginValid({email:req.body.email,password:req.body.password})
        if(validation.error)  res.status(400).send(validation.error.details[0].message)

        const repeatRg = await existence.checkExist(req.body.email).then(function(results){
            return results ; //result.exists = true
        })
        if( repeatRg.exists === false) res.status(400).send("email not exist")

        const userInfo = await User.listUsers(req.body.email)


        const checkPassword = await bcrypt.compare(req.body.password,userInfo[0].password)
        if(!checkPassword)  res.status(400).send("password not valid")

        /*create json web token*/
        //let randomString = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        let token = jwt.sign({"id":userInfo[0].id},"randomString")
        res.setHeader("auth-token",token)
        const result = await User.loginUser(token,req.body.email)
        //console.log(result)
        if (result) res.status(200).send({"userId":result[0].id.toString(),"token":token})
    }catch (e) {
        console.log(e)
    }
}

/*login function delete token in db*/
exports.logOut = async function(req,res){
    try{
        const isLogOut = await User.logOutUser(req.header('X-Authorization'))
        console.log(req.header('X-Authorization'))
        console.log(isLogOut)
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

/*get user info with/without token*/
exports.getDetails = async function(req,res){
    try{
        //console.log(req.header('X-Authorization')) 
        const user = await User.listUsersById({"id":req.params.id})
        verify.auth(req,res,user)
    }catch (e) {
        console.log(e)
    }
}


/*get user img with/without token*/

exports.uploadImg = async function(req,res){
    try{
        //imageHandler.imgType()
        //console.log(req.body) //{}
        //console.log()
        res.send(req.data) //[] actully is null 
    }catch(e){
        console.log(e)
    }
    //console.log(result)
}

exports.getImg = async function(req,res){
    try{
        const result = await User.imgGet(req,res)
        let isExist = false;

        result.forEach(item=>{
            if(item.image_filename){
                isExist = true
            }
        })

        if(isExist == true){
            let image_filename = result[0].image_filename
            console.log(image_filename)
            const data = imageHandler.readImg(image_filename)
            let imageType = imageHandler.imgType(image_filename)
            console.log(imageType.mime)
            res.writeHead(200, {
                'Content-Type': `${imageType.mime}`
            }).end(data) 
        }else{
            res.status(404).send("image not found")
        }
}catch(e){
    console.log(e)
    res.status(500).send("Interal Server Error")
    }
}





exports.deleteImg = function(req,res){
    try{
        //要先判断 auth 的模块
        const auth = verifyUpgrade.auth
        if(auth === true){
            const execution = User.imgDelete(req,res)
            res.status(200).send('user profile image delete')
        }else{
            res.status(401).send("user not authorized")
        }
    }catch(e){
        res.status(500).send("Interal Server Error")
    }
}


