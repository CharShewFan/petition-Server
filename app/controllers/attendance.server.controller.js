const dbAtt = require("../models/attendance.model")
const user = require("../models/user.model")



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
    let userInfo = await user.retriveIdByToken(token)
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




exports.rmAtt = async function(){
    return null
}