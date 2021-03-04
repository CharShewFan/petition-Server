const db = require('../../config/db')

exports.listCategory = async function(){
        const sql = "SELECT * FROM category";
        const connection = await db.getPool().getConnection();
        let [rows,fields] = connection.query(sql)
        console.log(rows)
        return rows

}

exports.findById = async function(id){
        const sql = `SELECT * FROM category WHERE id = ${id}`
        const connection = await db.getPool().getConnection();
        let [rows,fileds] = await connection.query(sql);
        console.log(rows)
        return rows
}

exports.findByName = async function(){

}