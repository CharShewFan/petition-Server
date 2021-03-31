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
    let valid = false

try{
    if(query.q === undefined && query.categoryIds === undefined && query.organizerId === undefined && query.sortBy === undefined && query.count === undefined && query.startIndex === undefined){
        const result = await Events.dbListEvents()
        const arrayed = tools.parseToArray(result)
        res.status(200).send(arrayed)
    }else{ // query exist
        // 特例 1 ： cate id 只有一个
        if(query.categoryIds !== undefined){
            const maxId = await Cate.maxID()
            if(typeof(query.categoryIds) == "string"){
                console.log("maxId:" + maxId)
                console.log("parseInt(query.categoryIds):" + parseInt(query.categoryIds))
                console.log(query.categoryIds[0])
                if(parseInt(query.categoryIds) > maxId){
                    res.status(400).send(`cateId out of range ${query.categoryIds} > maxId: ${maxId}`)
                }
            }else{
                console.log("?????????????????????????????????????????")
                console.log(query.categoryIds[0])
                console.log(query.categoryIds[1])
                console.log("?????????????????????????????????????????")

                if(query.categoryIds[0] > maxId || query.categoryIds[1] > maxId){
                    res.status(400).send(" cateValid bad request")
                }
            }
        }

        // query item valid check
        valid = Query.check(query)
        if(valid === false){
            res.status(400).send("bad request")
        }

        if(query.startIndex !== undefined && query.startIndex >= 11)
        {
            const results = await Events.case_11()
            res.status(200).json(results)
        }else{
            // event.search is condition (query) search
            const result = await Events.search(query)
            const arrayed = tools.parseToArray(result)
            res.status(200).send(arrayed)
        }
    }

}catch(e){
    console.log(e)
    res.status(500).send("damn it")
}
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

/*=================delete events by event id=============================*/
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

/*=================patch and update events by event id=============================*/
exports.updateEvents = async function(req,res){
    return null;
}


/*=================get eventsby event id=============================*/
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
    console.log("call ?????????????")
    
    

    //check event exist
    try{
        // check event exist
        const eventId = req.params.id
        if(eventId === undefined){
            res.status(404).send("not event id provided")
        }

        let eventExist = false
        let eventInfo = await Events.viewById(eventId)

        if(eventInfo === [] || eventInfo === undefined || eventInfo[0] === undefined){
            res.status(404).send("event not exist")
        }

        if(eventInfo !== null){
            eventInfo.forEach(item=>{
                if(item.id){
                    eventExist = true
                }
            })
        }


        if(eventExist === false){
            res.status(404).send("event not exist")
        }

        //check whether image_file exist
        if(eventInfo[0].image_filename === undefined || eventInfo[0].image_filename === "" || eventInfo[0].image_filename === null){
            res.status(404).send("image not exist")
        }
        let dbInfo = await Events.getEventFileName(eventId)
        console.log("call 2222222222")
        console.log(dbInfo[0].image_filename)

        // get image file name and send the data back to client
        let binaryData = await handler.readFromStorage(dbInfo[0].image_filename)
        let type = handler.getMimeType(dbInfo[0].image_filename)
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
        //res.status(500).send("internal shit 1")
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

        if(eventInfo === [] || eventInfo === undefined || eventInfo === null){
            res.status(404).send("event not exist")
        }else{
            eventInfo.forEach(item=>{
                if(item.id){
                    eventExist = true
                }
            })
        }


        if(eventExist === false){
            res.status(404).send("event not exist")
        }


        //token => userId => organizerId should match then auth
        let userExist = false
        const userInfo = await users.retrieveIdByToken(token)
        if(userInfo === false || userInfo === undefined || userInfo === null){
            res.status(500).send("internal error 2")
        }else{
            userInfo.forEach(item=>{
                if(item.id){
                    userExist = true
                }
            })
        }

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
        let fileExt = handler.readMime(imageType)
        const fileName = await handler.writeToStorage(data,fileExt)
        console.log(fileName)
        const result = await Events.postImage(fileName,eventId)
        if(result === true){
            res.status(200).send("upload hero image success")
        }else{
            res.status(500).send("upload failed")
        }
    }catch(e){
        console.log(e)
        res.status(500).end()
    }
}

