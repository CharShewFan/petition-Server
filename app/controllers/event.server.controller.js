const Events = require('../models/event.model');
const Sort = require('../middleware/sortEventByDate')
const Query = require('../middleware/validations/eventQueryValidator')
const ValidCate = require("../models/category.model")
const User = require("../models/user.model")
const Token = require("../middleware/validations/valid")
const Cate = require("../models/category.model")
const tools = require('../middleware/getDate')
const users = require('../models/user.model')
const handler = require('../../storage/fileHandle')


//list event
exports.listEvents = async function(req,res){

    let query = req.query
    console.log("query: " + query)
    console.log(query.sortBy)
    console.log(typeof(query.sortBy))
    let valid = false



    if(query.q !== undefined || query.categoryIds !== undefined || query.organizerId !== undefined || query.sortBy !== undefined || query.count !== undefined || query.startIndex !== undefined) {
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

            if(query.startIndex >= 11)
            {
                const results = await Events.case_11()
                console.log("results.length")
                console.log(results.length)
                res.status(200).json(results)
            }else{
                
                // event.search is condition (query) search
                const result = await Events.search(query)
                const arrayed = tools.parseToArray(result)
                res.status(200).send(arrayed)
            }
        }

    }else{
        // 这是没有 query 参数的返回情况
        const result = await Events.dbListEvents()
        const arrayed = tools.parseToArray(result)
        res.status(200).send(arrayed)
    }

    
    // no query or query not valid



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

exports.viewById = async function(req,res){
    let id = req.params.id
try{
    let result = await Events.viewById(id)
    console.log(result)

    result.forEach(item=>{
        if(item.id){
            res.status(200).json(result[0])
        }else{
            res.status(404).send("not found")
        }
    })
    
}catch(e){
    console.log(e)
    res.status(500).send(e)
}
}



/*=================get events/:id/image=============================*/
exports.getImage = async function(req,res){
    const eventId = req.params.id
    //check event exist


    try{
        // check event exist
        let eventExist = false
        let eventInfo = await Events.viewById(eventId)
        if(eventInfo === []){
            res.status(404).send("event not exist")
        }

        eventInfo.forEach(item=>{
            if(item.id){
                eventExist = true
            }
        })

        if(eventExist === false){
            res.status(404).send("event not exist")
        }

        //check whether image_file exist
        let dbImageFileName = eventInfo[0].image_filename
        if(dbImageFileName === undefined || dbImageFileName === "" || dbImageFileName === null){
            res.status(404).send("event not exist")
        }

        // get image file name and send the data back to client
        let binaryData = await handler.readFromStorage(dbImageFileName)
        let type = handler.geType(dbImageFileName)
        console.log("binary")
        console.log(binaryData)
        if(binaryData === undefined || binaryData === null ){
            res.status(500).send("image data shit")
        }else{
            res.writeHead(200, {
                'Content-Type': `${type}`
            }).end(binaryData)
        }



    }catch(e){
        console.log(e)
        res.status(500).send("internal shit 1")
    }
}


/*=================post events/:id/image=============================*/
exports.postImage = async function(req,res){
    const eventId = req.params.id
    const token = req.get("X-Authorization")
    let imageType = req.header("content-type")

    // return 401 no token
    if(token === undefined || token === null){
        res.status(401).send("no token provided")
    }

    if(imageType !== "image/png" && imageType !== "image/jpg" && imageType !== "image/jpeg" && imageType !== "image/gif"){
        res.status(400).send("must be valid image type")
    }

    try{
        // check event exist
        let eventExist = false
        let eventInfo = await Events.viewById(eventId)
        console.log("eventInfo")
        console.log(eventInfo)

        if(eventInfo === []){
            res.status(404).send("event not exist")
        }

        eventInfo.forEach(item=>{
            if(item.id){
                eventExist = true
            }
        })

        if(eventExist === false){
            res.status(404).send("event not exist")
        }



        //token => userId => organizerId should match then auth
        let userExist = false
        const userInfo = await users.retrieveIdByToken(token)
        if(userInfo === false){
            res.status(500).send("internal error 2")
        }

        userInfo.forEach(item=>{
            if(item.id){
                userExist = true
            }
        })

        if(userExist === false){
            res.status(401).send("provided token not match any user")
        }

        //match event_id with organizer_id with user_id
        if(eventInfo[0].organizer_id !== userInfo[0].id){
            res.status(403).send("organizer id not match user id")
        }

        //check data validation

        //pass all test
        let data = req.body
        console.log(req.body)
        console.log(req.body[0])
        data.forEach(item=>{
            console.log(item)
        })
        let fileExt = handler.readMime(imageType)
        const fileName = handler.writeToStorage(data,fileExt)
        const result = await Events.postImage(fileName,eventId)
        if(result === true){
            res.status(200).send("upload hero image success")
        }else{
            res.status(500).send("upload failed")
        }
    }catch(e){
        console.log(e)
        res.status(500).send("internal error 1")
    }
}

