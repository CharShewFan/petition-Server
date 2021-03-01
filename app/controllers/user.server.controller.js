const User = require('../models/user.model');

exports.listAllUsers = async function(req,res){
    try{
        let user_list = await User.listUsers();
        res.status(200)
            .send(user_list)
    }catch (e){
        res.status(500)
            .send(`error getting user list ${e}`)
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
