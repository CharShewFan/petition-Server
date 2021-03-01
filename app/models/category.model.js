const db = require('../../config/db')

exports.listCategory = async function(){
        const sql = "SELECT * FROM category";
        const connection = await db.getPool().getConnection();
        const [rows,fields] = await connection.query(sql)
        return rows;
}