const db = require('../../config/db');
const fs = require("mz/fs");
const randomString = require('randomstring')
const path = "../../storage/images"


/*==================upload image======================*/
exports.uploadToServer = async function (file_name,id) { //check whether exist first . then upload
    const sql = `UPDATE user SET image_filename = '${file_name}' WHERE id = '${id}'`
    try{
        const connection = await db.getPool().getConnection()
        const query = await connection.query(sql)

        connection.release()
    }catch(e){
        console.log(e)
    }
}







exports.deleteFromServer = async function (req,res){
    const sql = `UPDATE user SET image_filename = NULL WHERE id = ${req.params.id}`
    try{
        const connection = await db.getPool().getConnection()
        const result = connection.query(sql)

        connection.release()
    }catch(e){
        res.status(500)
    }
}








exports.retriveFromServer = async function (req,res){
    const sql = `SELECT image_filename FROM user WHERE id = "${req.params.id}"`
    console.log(req.params.id)

    try{
        const connection = await db.getPool().getConnection()
        const [rows,fields] = await connection.query(sql)
        console.log("-----------------------")
        console.log(rows)

        connection.release()
        return rows
        
    }catch(e){
        console.log(e)
        res.status(500).send("Interal Server Error")
    }
}
