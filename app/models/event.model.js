const db = require('../../config/db')
const builder = require('../middleware/buildSQL')


exports.dbListEvents = async function(){
try{
        //console.log("event model called")
        const sql = "SELECT e.id as eventId,title,ec.categories,u.first_name as organizerFirstName, u.Last_name as organizerLastName,numAcceptedAttendees,capacity  FROM event as e join user as u on u.id = e.organizer_id join (SELECT event_id ,count(*) as numAcceptedAttendees from event_attendees WHERE attendance_status_id = 1 GROUP BY event_id) as attNum on e.id = attNum.event_id join (SELECT GROUP_CONCAT(category_id) as categories,event_id from event_category GROUP by event_id) as ec on ec.event_id = e.id order by e.id ASC "
        const connection = await db.getPool().getConnection()
        let [rows,field] =  await connection.query(sql)
        connection.release()
        return rows
}catch(e){
    console.log(e)
}
}



exports.case_11 = async function(){
try{
        const sql = "SELECT * FROM event WHERE id = 100000"
        const connection = await db.getPool().getConnection()
        let [rows,field] =  await connection.query(sql)
        connection.release()
        return rows
}catch(e){
    console.log(e)
}
}






exports.search = async function(query){
    try{
        const sql = builder.SQL(query)
        const connection = await db.getPool().getConnection()
        const [rows,fields] = await connection.query(sql.sql,sql.value)
        connection.release()
        return rows
    }catch(e){
        console.log(e)
    }
}

// add event need authentication
exports.addEvents  = async function(body,id){
try{
    //need a SQL builder
    const sql = builder.addEvent(body,id)
    const sql2 = 'SELECT MAX(id) AS event_id from event'
    const connection = await db.getPool().getConnection()
    const result = await connection.query(sql.sql,[sql.value])
    const [rows,fields] = await connection.query(sql2)

    connection.release()
    return rows
}catch(e){
    console.log(e)
}

}


//auth user delete own event
exports.deleteEvent = async function(auth_token,email,user_id){
    const connection = db.getPool().getConnection()
    connection.query(`DELETE user_id,user_email from user where user_id = ${user_id} and email = ${email}`)
    let check = connection.query(`SELECT user_id,user_email from user where user_id = ${user_id} and email = ${email}`)
    return check
}

//search event by id
exports.viewById = async function(id){

try{
    const sql = `SELECT * from event WHERE id = ${id}`
    const connection = await db.getPool().getConnection()
    let [rows,field] =  await connection.query(sql)
    connection.release()
    return rows

}catch(e){
    console.log(e)
    return []
}
}


//post image to event
exports.postImage = async function(fileName,eventId){
    try{
        const sql = `UPDATE event SET image_filename = '${fileName}' WHERE id = ${eventId}`
        const connection = await db.getPool().getConnection()
        await connection.query(sql)
        connection.release()
        return true

    }catch (err){
        console.log(err)
        return false
    }
}