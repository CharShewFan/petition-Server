const dbAtt = require("../models/attendance.model")



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

exports.addAtt = async function(){
    return null
}


exports.rmAtt = async function(){
    return null
}