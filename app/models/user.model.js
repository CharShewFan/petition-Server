const db = require('../../config/db');
const fs = require('mz/fs');

exports.listUsers = async function (req,res){
    try{
        const sql = "SELECT * from 'user'"
        const result = await db.getPool().getConnection().query(sql)
        console.log('the users list is:' + result)
        return result;
    }catch (e) {
        res.status(500).send("request failed",e)
    }

}

