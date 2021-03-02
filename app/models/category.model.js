const db = require('../../config/db')

exports.listCategory = async function(req,res){
        const sql = "SELECT * FROM category";
        const connection = await db.getPool().getConnection();
        let [rows,fields] = await connection.query(sql)
        return rows

}