const db = require('../../config/db')
const builder = require('../middleware/buildSQL')


exports.dbListEvents = async function(){
    //console.log("event model called")
    const sql = "SELECT * FROM event "
    const connection = await db.getPool().getConnection()
    let [rows,field] =  await connection.query(sql)
    connection.release()
    //console.log([rows,field])
    return rows
}

exports.case_11 = async function(){
    //console.log("event model called")
    const sql = "SELECT * FROM event WHERE id = 11"
    const connection = await db.getPool().getConnection()
    let [rows,field] =  await connection.query(sql)
    connection.release()
    //console.log([rows,field])
    return rows
}

exports.search = async function(query){
    try{
        const sql = builder.SQL(query)
        console.log(sql.sql)
        console.log(sql.value)

        const connection = await db.getPool().getConnection()
        const [rows,fields] = await connection.query(sql.sql,sql.value)
        connection.release()
        //console.log(rows)
        return rows
    }catch(e){
        console.log(e)
    }
}

// add event need authentication
exports.addEvents  = async function(body,id){
    //need a SQL builder
    const sql = builder.addEvent(body,id)
    const sql2 = 'SELECT MAX(id) AS event_id from event'
    const connection = await db.getPool().getConnection()
    const result = await connection.query(sql.sql,[sql.value])
    const [rows,fields] = await connection.query(sql2)

    connection.release()
    return rows
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
        const sql = `UPDATE event SET 'image_filename' = ${fileName} WHERE id = ${eventId}`
        const connection = await db.getPool().getConnection()
        const result = await connection.query(sql)
        return true

    }catch (err){
        console.log(err)
        return false
    }
}