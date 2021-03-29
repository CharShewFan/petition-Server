const db = require('../../config/db')

exports.listAll = async function(){
        console.log("calllllllllllllllll")
        const sql = "SELECT * FROM category"
        const connection = await db.getPool().getConnection();
        let [rows,fields] = await connection.query(sql) //connection 前面必须要有 await

        connection.release()
        return rows
}

exports.findById = async function(id){
        const sql = `SELECT * FROM category WHERE id = ${id}`
        const connection = await db.getPool().getConnection();
        let [rows,fileds] = await connection.query(sql);

        connection.release()
        return rows
}

exports.findByName = async function(){
        return null
}


exports.validCateId = async function(categoryIds){
        let StartIndex = categoryIds[0]
        let endIndex = categoryIds[1]
        //console.log(StartIndex)
        const sql = "SELECT * FROM event_category WHERE category_id BETWEEN ? AND ? ORDER BY category_id ASC";
        const connection = await db.getPool().getConnection();
        let [rows,fields] = await connection.query(sql,[StartIndex,endIndex]) //connection 前面必须要有 await
        connection.release()
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


// retrived category id list from db


exports.maxID = async function(){
        try{
                const sql = "SELECT MAX(id) AS id from category"
                const connection = await db.getPool().getConnection()
                const [rows,field] = await connection.query(sql)

                connection.release()
                return rows
        }catch(e){
                console.log(e)
        }
}

