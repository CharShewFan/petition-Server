const User = require('../models/user.model');

//retrieve all users data
exports.listAllUsers = async function(req,res){
    console.log("user constroller call")
    try{
        let user_list = await User.listUsers();
        
        res.status(200)
        res.send(user_list)
    }catch (e){
        res.send(e)
        console.log(e)

    }
}



exports.getDetails = async function(req,res){
    return null;
}

exports.addUser = async function(){
    return null;
}

exports.rmUser = async function(req,res){
    return null;
}

exports.updateUser = async function(req,res){
    return null;
}
