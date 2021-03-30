const db = require('../../config/db')


/* get /events/:id/attendees */

exports.findById = async function(eventId){
    try{
        const sql = `SELECT * from event_attendees WHERE event_id = ${eventId}`
        const connection = await db.getPool().getConnection()
        let [rows,field] =  await connection.query(sql)
        connection.release()
        return rows
    }catch(e){
        console.log(e)
    }
}


/*------------------------------retrive event_att info  with event id------------------------------------------- */
exports.listAtt = async function(eventId){
try{
    const sql = `SELECT user_id AS attendeeId,name AS status,first_name AS firstName,last_name AS lastName,date_of_interest AS dateOfInterest FROM event_attendees AS ea JOIN user AS u ON ea.user_id = u.id JOIN attendance_status AS ass ON attendance_status_id = ass.id WHERE event_id = ${eventId} AND attendance_status_id = 1 ORDER BY date_of_interest ASC`
    const connection = await db.getPool().getConnection()
    const [rows,fields] = await connection.query(sql)
    //console.log(rows)
    connection.release()
    return rows
}catch(e){
    console.log(e)
    return false
}
}

/*------------------------------retrive user token with event id------------------------------------------- */
exports.getToken = async function(eventId){
    try{
        const sql = `SELECT auth_token FROM event_attendees AS ea JOIN user AS u ON ea.user_id = u.id  JOIN event AS e ON ea.event_id = e.id  WHERE event_id = ${eventId}`
        const connection = await db.getPool().getConnection()
        const [rows,fields] = await connection.query(sql)
        console.log(rows)
        connection.release()
        return rows
    }catch(e){
        console.log(e)
        return false
    }
    }


 
/*==================join attendee by user_id,event_id======================*/
exports.joinEvent = async function (eventId,userId) {
    let value = [
        [eventId],
        [userId]
    ]
    console.log(value)
    try{

        let sql = `INSERT INTO event_attendees (event_id, user_id) VALUES (?) `
        const connection = await db.getPool().getConnection()
        const result = await connection.query(sql,[value])
        connection.release()
        return true
        
        
        //event exist ? 
    }catch(e){
        console.log(e)
        return false

    }
}


// check whether join event already
exports.joinStatus = async function(eventId,userId){
    try{
        const sql = `SELECT event_id from event_attendees WHERE user_id = ${userId} AND event_id = ${eventId}`
        const connection = await db.getPool().getConnection()
        const [rows,fields] = await connection.query(sql)
        console.log(rows)
        connection.release()
        return rows
    }catch(e){
        console.log(e)
        return false
    }
}
