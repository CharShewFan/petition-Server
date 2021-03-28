const db = require('../../config/db')


/* get /events/:id/attendees */

exports.view = async function(id){
    const sql = `SELECT * from `
    const connection = await db.getPool().getConnection()
    let [rows,field] =  await connection.query(sql)
}