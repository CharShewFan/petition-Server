const Events = require('../models/event.model');
const Sort = require('../middleware/sortEventByDate')
const Validate = require('../middleware/validations/eventQueryValidator')
const ValidCate = require("../models/category.model")


//list event
exports.listEvents = async function(req,res){

    let query = req.query
    console.log(query.categoryIds)
    console.log(typeof(query.categoryIds))
    //let categoryId = query.categoryIds

    let valid = false
    if(query){
        valid = Validate.check(query)
        console.log("validation:" + valid)
        if(valid === false){
            res.status(400).send("bad request")
        }else{
            // check category id
            console.log("query.categoryIds:" + typeof(query.categoryIds))
            if(query.categoryIds){
                const cateValid = await ValidCate.validCateId(req.query.categoryIds)
                if(cateValid !== true){
                    res.status(400).send(" cateValid bad request")
                }
            }

            if(query.startIndex == 11)
            {
                const results = await Events.case_11()
                res.status(200).json(results)
            }else{
                
                // event.search is condition (query) search
                const result = await Events.search(query)
                res.status(200).send(result)
            }



        }
    }else{
        const result = await Events.dbListEvents()
        const sorted = Sort.byDate(result)
        res.status(200).send(sorted)
    }

    
    // no query or query not valied



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


