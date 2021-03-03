const Events = require('../models/user.server.model');

exports.listEvents = async function(req,res){
    console.log("event controller called")
    try{
        const result = await Events.dbListEvents()
        if(result != null){
            res.send(result)
            res.status(200)
        }
        console.log("nothing received")
    }catch (e) {
        res.send(e)
        res.status(401)
    }
}

exports.addEvents = async function(){
    return null;
}
exports.ownEvents = async function(){
    return null;
}

exports.rmEvents = async function(req,res){
    return null;
}

exports.updateEvents = async function(req,res){
    return null;
}

exports.finder = async function(req,res){
    return null;
}


