const dbAtt = require("../models/attendance.model")
const user = require("../models/user.model")
const tools  = require("../middleware/getDate")
const timeTool = require('../middleware/validations/parse')



/*==================view attendees by event id======================*/
exports.viewAtt = async function(req,res){
    let eventId = req.params.id
    //let token = req.get("X-Authorization")
    let eventExist = false
    const result = await dbAtt.findById(eventId)

try{
    result.forEach(item=>{
        if(item.id){
            eventExist = true
        }
    })

    if(eventExist === false){
        res.status(404).send("event not exist")
    }else{
        // return accepted attendees
        const result_1 = await dbAtt.listAtt(eventId)
        if(result === false){
            res.status(500).send("internal err 1")
        }else{
            res.status(200).json(result_1)
        }
    }
    

}catch(e){
    console.log(e)
    res.status(500).send("internal server error")
}
}






/*==================join attendee by user_id,event_id======================*/
exports.addAtt = async function(req,res){
    let eventExist = false
    const eventId = req.params.id
    const result = await dbAtt.findById(eventId)
    let token = req.get("X-Authorization")
    console.log(result)

try{

    result.forEach(item=>{
        if(item.id){
            eventExist = true
        }
    })

    if(eventExist === false){
        res.status(404).send("event not found")
    }

    if(token === undefined || token === null){
        res.status(401).send("not authen token")
    }

    //有了 token 需要找到用户 id
    let userInfo = await user.retrieveIdByToken(token)
    console.log(userInfo)
    let userExist = false
    userInfo.forEach(item=>{
        if(item.id){
            userExist = true
        }
    })

    if(userExist === false){
        res.status(403).send("forbidden not allow join event")
    }else{
        // auth user
        let userId = userInfo[0].id
        let attended = false
        let attendCheck = await dbAtt.joinStatus(eventId,userId)
        if(attendCheck === false){
            res.status(500).send("db query failed")
        }

        attendCheck.forEach(item=>{
            if(item.event_id){
                attended = true
            }
        })

        if(attended === true){
            res.status(403).send("forbidden already joined")
        }else{
            const queryStatus = await dbAtt.joinEvent(eventId,userId)
            if(queryStatus === true){
                res.status(201).send("created")
            }else{
                res.status(500).send("internal error 4")
            }
        }

    }
}catch(e){
       console.log(e)     
       req.status(500).send("internal 5")
}
}



/*==================delete attendee by user_id,event_id======================*/
exports.rmAtt = async function(req,res){
    const token = req.get("X-Authorization")
    const event_id = req.params.id

    // token check 
    if(token === undefined || token === null){
        res.status(401).send("no token no authorized")
    }

    //check event exist ?
    let eventExist = false
    const result = await dbAtt.findById(event_id)
    result.forEach(item=>{
        if(item.id){
            eventExist = true
        }
    })

    if(eventExist === false){
        res.status(403).send("event not exist")
    }


    //find user by user token 
    let userInfo = await user.retrieveIdByToken(token)
    console.log(userInfo)
    let userExist = false
    userInfo.forEach(item=>{
        if(item.id){
            userExist = true
        }
    })

    console.log(userExist)
    if(userExist === false){
        res.status(401).send("user not exist")
    }

    // check have user join these event and retrieve attendance_status_id,date_of_interest
    let user_id = userInfo[0].id
    let joined = false
    let joinedSearch = await dbAtt.joinStatusFull(event_id,user_id)
    console.log("123456789")
    console.log(joinedSearch)
    console.log("123456789")

    if(joinedSearch === false){
        res.status(500).send("internal error")
    }

    joinedSearch.forEach(item=>{
        if(item.date_of_interest){
            joined = true
        }
    })

    if(joined === false){
        res.status(403).send("user havent join these event")
    }

    let att_status = joinedSearch[0].attendance_status_id
    if(att_status === 3 || att_status === "3"){
        res.status(403).send("user been rejected joining this event")
    }

    let date = joinedSearch[0].date_of_interest

    let now = tools.now() // need a date generator
    console.log(now)
    console.log(date)
    if(date < now){
        res.status(403).send("a past event")
    }else{
            // pass all valid test
            const results = await dbAtt.leaveEvent(event_id,user_id)
            if(results === true){
                res.status(200).send("delete succefully")
            }else{
                res.status(500).send("internal error 5")
            }
    }
}