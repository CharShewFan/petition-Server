const db = require('../../config/db');

exports.listUsers = async function (){
    console.log("user model called")
    const sql = "SELECT * from user"
    const connection = await db.getPool().getConnection();
    let [rows,feilds] = connection.query(sql);
    return rows;
}


