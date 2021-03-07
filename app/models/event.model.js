const db = require('../../config/db')


exports.dbListEvents = async function(){
    console.log("event model called")
    const sql = "SELECT * FROM event "
    const connection = await db.getPool().getConnection
    let [rows,field] =  await connection.query(sql)
    console.log([rows,field])
    return rows
}

exports.startIndex = async function(index){
    const sql = `SELECT * FROM category where id >= ${index} `;
    const connection = await db.getPool().getConnection();
    let [rows,fields] = await connection.query(sql)
    return rows
}


// add event need authentication
exports.add_events  = async function(data){
    const sql = `INSERT INTO event("id", "title", "description", "date", "image_filename", "is_online", "url", "venue", "capacity", "requires_attendance_control", "fee", "organizer_id") VALUES (${data})`
    const connection = await db.getPool().getConnection()
    let result = await connection.query(sql)
    return result
}

// auth user delete own event
// exports.deleteEvent = async function(auth_token,email,user_id){
//     const connection = db.getPool().getConnection()
//     connection.query(`DELETE user_id,user_email from user where user_id = ${user_id} and email = ${email}`)
//     let check = connection.query(`SELECT user_id,user_email from user where user_id = ${user_id} and email = ${email}`)
//     const check = connection.query
// }

