const db = require('../../config/db');



exports.listUsers = async function (email){
    console.log("user model called")
    const sql = "SELECT * from user WHERE email = ?"
    const connection = await db.getPool().getConnection();
    let [rows,feilds] = await connection.query(sql,[email]);
    return rows;
}

/*-------------------------------------------------*/

exports.listUsersById = async function (id){
    try{
        const sql1 = `SELECT * FROM user WHERE id = '${id}'`
        const connection = await db.getPool().getConnection()
        const [rows,fileds] = await connection.query(sql1)
        return rows;
    }catch (e){
        console.log(e)
    }
}

/*-------------------------------------------------*/

/*return a user id by query with a email when create user successfully*/
exports.returnEmail = async function(email){
    const sql = 'SELECT email FROM user WHERE email = ?'
    try{
        
        const connection = await db.getPool().getConnection()
        let [rows,fields] = await connection.query(sql,[email])
        return rows.length < 1 ? null : rows

    }catch (e) {
        console.log(e)
        return null
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


/*----------------------update user info---------------------------*/


exports.updateUserInfo = async function(params){
    console.log("update user module called")
   // const sql = `UPDATE user SET email=${params.email},first_name=${first_name},last_name=${params.last_name},image_filename=${params.image_filename},password=${params.password},auth_token=${params.auth_token} WHERE id = ${params.id}`
    const sql = `UPDATE user SET "${params[0]}" = "${params[1]}" WHERE id = ${params[2]}`
    const connection = await db.getPool().getConnection()
    const status = await connection.query(sql)
    const [rows,fields] = await listById(params.id)
    return [rows]
}

/*--------------------login user-----------------------------*/


exports.loginUser = async function(token,email) {
    try{
        //console.log("model called")
        const sql = `UPDATE user SET auth_token = '${token}' WHERE email = '${email}'` // 规范查询📖
        const sql2 = `SELECT id FROM user WHERE email = '${email}'`
        const connection = await db.getPool().getConnection();
        const loginQuery = await connection.query(sql)
        const [rows, fields] = await connection.query(sql2)
        return rows
    }catch (e) {
        console.log(e)
    }
}

/*--------------------logout user-----------------------------*/


exports.logOutUser = async function(token){
    try{
        const connection = await db.getPool().getConnection();
        const sql1 = `SELECT * FROM user WHERE auth_token = '${token}'`
        const [rows,fields] = await connection.query(sql1)

        let isExist = false
        rows.forEach(item => {
            //console.log("1 "+item.email)
            if (item.email) {
                //console.log("1 "+item.email)
                isExist = true
            }
        })

        //user exist and token is true
        if (isExist === true) {
            const sql2 = `UPDATE user SET auth_token = NULL WHERE email = "${rows[0].email}"`
            const result = await connection.query(sql2)
        }

        return isExist
    }catch (e){
        console.log(e)
    }
}



/*==================retrived hashed password======================*/
exports.retrivePassword = async function(req,res){
    try{
        const sql =  `SELECT password from user WHERE id = "${req.params.id}"`
        const connection = await db.getPool().getConnection()
        const [rows,fields] = connection.query(sql)
        return rows
    }catch(e){
        console.log(e)
    }
}

/*==================retrived userId by token======================*/
exports.retriveIdByToken = async function(token){
    try{
        const sql =  `SELECT id from user WHERE auth_token = "${token}"`
        const connection = await db.getPool().getConnection()
        const [rows,fields] =await connection.query(sql)
        return rows
    }catch(e){
        console.log(e)
    }
}


