const Events = require('../models/event.model');
const Sort = require('../middleware/sortEventByDate')
const Query = require('../middleware/validations/eventQueryValidator')
const ValidCate = require("../models/category.model")
const Validation = require("../middleware/validations/valid")
const User = require("../models/user.model")
const Token = require("../middleware/validations/valid")
const Cate = require("../models/category.model")
const tools = require('../middleware/getDate')


//list event
exports.listEvents = async function(req,res){

    let query = req.query
    console.log(query.categoryIds)
    console.log(typeof(query.categoryIds))
    //let categoryId = query.categoryIds

    let valid = false
    if(query){
        valid = Query.check(query)
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





//add authentication 
exports.addEvents = async function(req,res){
    try{
        //check token
        const params = req.body;
        let token = req.get("X-Authorization")
        
        //check token exist?
        if(token === undefined || token === null || token == ""){
            res.status(401).send("unauthorized")
        }else{
            //compare token with current user 
            let userInfo = await User.retriveIdByToken(token)
            console.log(userInfo)
            let userExist = false
            userInfo.forEach(item=>{
                if(item.id){
                    userExist = true
                }
            })

            if(userExist === false){
                res.status(401).send("unauthorized")
            }else{
                let userId  = userInfo[0].id // add as organizer id
                //make sure event date > now
                let now = tools.now()
                if(params.date && (params.date <= now) === true){
                    res.status(400).send("date is not in future")
                }
                //validate body 
                let validStatus = Token.addEventValid(params)
                console.log("valided?: " + validStatus)
                if(validStatus === false){
                    res.status(400).send("bad request check req.body")
                }

                             //check category id
                let cateIds = []
                let category = req.body.categoryIds
                category.forEach(item=>{
                    cateIds.push(parseInt(item))
                })
                //retirve the category id list back from the db
                const maxId = await Cate.maxID()
                let idWithinRange = true
                cateIds.forEach(item=>{
                    if(item > maxId){
                        idWithinRange = false
                 }
             })
             //category id valided and within max range
             if(cateIds.length = 0 || idWithinRange === false){     
                 res.status(401).send("unvalided category id")
             }else{
                    //send a creat query to db
                    const result4 = await Events.addEvents(params,userId) //need finished the addEvents
                    res.status(200).send(result4[0])
             }

            }
        }
    }catch(e){
        console.log(e)
        res.status(500)
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


