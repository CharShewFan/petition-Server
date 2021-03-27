const db = require('../../config/db')
const build = require('../middleware/buildSQL')


exports.dbListEvents = async function(){
    //console.log("event model called")
    const sql = "SELECT * FROM event "
    const connection = await db.getPool().getConnection()
    let [rows,field] =  await connection.query(sql)
    //console.log([rows,field])
    return rows
}

exports.case_11 = async function(){
    //console.log("event model called")
    const sql = "SELECT * FROM event WHERE id = 11"
    const connection = await db.getPool().getConnection()
    let [rows,field] =  await connection.query(sql)
    //console.log([rows,field])
    return rows
}

exports.search = async function(query){
    try{
        const sql = build.SQL(query)
        console.log(sql.sql)
        console.log(sql.value)

        const connection = await db.getPool().getConnection()
        const [rows,fields] = await connection.query(sql.sql,sql.value)
        //console.log(rows)
        return rows
    }catch(e){
        console.log(e)
    }
}



// add event need authentication
exports.add_events  = async function(data){
    const sql = `INSERT INTO event("id", "title", "description", "date", "image_filename", "is_online", "url", "venue", "capacity", "requires_attendance_control", "fee", "organizer_id") VALUES (${data})`
    const connection = await db.getPool().getConnection()
    let result = await connection.query(sql)
    return result
}


//auth user delete own event
exports.deleteEvent = async function(auth_token,email,user_id){
    const connection = db.getPool().getConnection()
    connection.query(`DELETE user_id,user_email from user where user_id = ${user_id} and email = ${email}`)
    let check = connection.query(`SELECT user_id,user_email from user where user_id = ${user_id} and email = ${email}`)
    return check
}

