const db = require('../../config/db')

exports.listCategory = async function(id){
        const sql = "SELECT * FROM category WHERE id = ?";
        const connection = await db.getPool().getConnection();
        let [rows,fields] = await connection.query(sql,[id]) //connection 前面必须要有 await
        return rows
}

exports.findById = async function(id){
        const sql = `SELECT * FROM category WHERE id = ${id}`
        const connection = await db.getPool().getConnection();
        let [rows,fileds] = await connection.query(sql);
        return rows
}

exports.findByName = async function(){
}


exports.validCateId = async function(categoryIds){
        let StartIndex = categoryIds[0]
        let endIndex = categoryIds[1]
        //console.log(StartIndex)
        const sql = "SELECT * FROM event_category WHERE category_id BETWEEN ? AND ? ORDER BY category_id ASC";
        const connection = await db.getPool().getConnection();
        let [rows,fields] = await connection.query(sql,[StartIndex,endIndex]) //connection 前面必须要有 await
        //console.log(rows)
        let isExist = false
        try{
        rows.forEach(element => {
                if(element.id){
                        isExist = true  
                }
        
        
        })
        //console.log("isexsit:" + isExist)
        return isExist
        }catch(e){
                if(e) throw e;
        }
}

