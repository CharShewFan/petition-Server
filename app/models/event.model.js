const db = require('../../config/db')


exports.dbListEvents = async function(){
    console.log("event model called")
    const sql = "SELECT * FROM event"
    const connection = await db.getPool().getConnection
    let [rows,field] = await connection.query(sql)
    return rows
}