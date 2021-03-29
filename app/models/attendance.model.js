const db = require('../../config/db')


/* get /events/:id/attendees */

exports.view = async function(id){
    const sql = `SELECT * from event_attendees`
    const connection = await db.getPool().getConnection()
    let [rows,field] =  await connection.query(sql)

    connection.release()
    return rows
}