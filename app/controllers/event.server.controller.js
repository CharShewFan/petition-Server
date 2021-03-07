const Events = require('../models/event.model');
const middleware = require('../middleware/sortEventByDate')


//list events test failed
exports.listEvents = async function(req,res){
    console.log("event controller called")
    try{
        const result = await Events.dbListEvents()
        //let sortedResult = middleware.sortByDate(result)
        console.log(result[1].id)
        res.send(result[1].id)
        res.status(200)
    }catch (e) {
        res.send(e)
        res.status(401)
    }

}

//need authentication 
exports.addEvents = async function(req,res){
    try{
        const params = req.params.body;
        const result = Events.add_events

    }catch(e){
        console.log(e)
    }
}



exports.indexSearcher = async function(req,res){
    let index = req.body.params
    const result = await Events.dbListEvents(index)
    try {

        let sortedResult = middleware.sortByDate(result)
        res.send(sortedResult)
        res.send(200)
    }
    catch (e){
        res.status(401)
        res.send("result not found ?")
    }
}

exports.rmEvents = async function(req,res){
    try{
        const password = req.body.password;
        const user_id = req.body.user_id;
        const user_email = req.body.email;
        const result = Events.deleteEvent(password,user_id,user_email);
        
    }catch(e){
        res.send(e)
    }

}

exports.updateEvents = async function(req,res){
    return null;
}

exports.finder = async function(req,res){
    return null;
}


