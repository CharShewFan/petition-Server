const db = require('../../config/db');

exports.listUsers = async function (email){
    console.log("user model called")
    const sql = "SELECT * from user WHERE email = ?"
    const connection = await db.getPool().getConnection();
    let [rows,feilds] = await connection.query(sql,[email]);
    return [rows];
}


/*return a user id by query with a email when create user successfully*/
exports.returnEmail = async function(email){
    try{
        const sql = 'SELECT email FROM user WHERE email = ?'
        const connection = await db.getPool().getConnection()
        const [rows,fields] = await connection.query(sql,[email])
        let isExist = false
        rows.forEach(item => {
            if (item.email) {
                isExist = true
            }
        })
        if (isExist) {
            return rows[0].email
        }

        else{
            return  false
        }

    }catch (e) {
        console.log(e)
    }

}


/*-------------------------------------------------*/


exports.addUser = async function(firstName,lastName,email,password){
    let values = [
        [email],
        [firstName],
        [lastName],
        [password],
    ]

try{
    const sql = 'INSERT INTO user (email, first_name, last_name, password) VALUES (?) '
    const sql2 = 'SELECT id from user WHERE email = ?'
    const connection = await db.getPool().getConnection()
    await connection.query(sql,[values])
    const [rows,fields] = await connection.query(sql2,[email])
    return rows[0].id
}catch (e) {
    console.log(e)
}
}


/*-------------------------------------------------*/


exports.deleteUser = async function(params){
    console.log("delete user module called")
    const sql = `DELETE from user where id = ${params.id}`
    const connection = await db.getPool().getConnection()
    const status = await connection.query(sql)
    return status
}


/*-------------------------------------------------*/


exports.updateUserInfo = async function(params){
    console.log("update user module called")
    const sql = `UPDATE user SET email=${params.email},first_name=${first_name},last_name=${params.last_name},image_filename=${params.image_filename},password=${params.password},auth_token=${params.auth_token} WHERE id = ${params.id}`
    const connection = await db.getPool().getConnection()
    const status = await connection.query(sql)
    const [rows,fields] = await listById(params.id)
    return [rows]
}




