const db = require('../../config/db')


exports.dbListEvents = async function(){
    console.log("event model called")
    const sql = "SELECT * FROM event WHERE id = 1"
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