const db = require('../../config/db');



exports.listUsers = async function (email){
    console.log("user model called")
    const sql = "SELECT * from user WHERE email = ?"
    const connection = await db.getPool().getConnection();
    let [rows,feilds] = await connection.query(sql,[email]);
    return rows;
}

exports.listUsersById = async function (params){
    try{
        const sql1 = `SELECT * FROM user WHERE id = '${params.id}'`
        const connection = await db.getPool().getConnection()
        const [rows,fileds] = await connection.query(sql1)
        console.log("01")
        console.log(rows[0])
        return rows;
    }catch (e){
        return e
    }
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
   // const sql = `UPDATE user SET email=${params.email},first_name=${first_name},last_name=${params.last_name},image_filename=${params.image_filename},password=${params.password},auth_token=${params.auth_token} WHERE id = ${params.id}`
    const connection = await db.getPool().getConnection()
    const status = await connection.query(sql)
    const [rows,fields] = await listById(params.id)
    return [rows]
}

/*-------------------------------------------------*/


exports.loginUser = async function(token,email) {
    try{
        console.log("model called")
        const sql = `UPDATE user SET auth_token = '${token}' where email = '${email}'` // 规范查询📖
        const sql2 = `SELECT id FROM user WHERE email = '${email}'`
        const connection = await db.getPool().getConnection();
        const loginQuery = await connection.query(sql)
        const [rows, fields] = await connection.query(sql2)
        return rows
    }catch (e) {
        console.log(e)
    }
}

/*-------------------------------------------------*/

exports.logOutUser = async function(token){
    try{
        const connection = await db.getPool().getConnection();

        const sql1 = `SELECT * FROM use where auth_token = '${token}'`
        const [rows,fields] = await connection.query(sql1)

        let isExist = false
        rows.forEach(item => {
            if (item.email) {
                isExist = true
            }
        })

        if (isExist) {
            const sql2 = `UPDATE user SET auth_token = NULL where auth_token = '${token}'`
            const [rows2,fields2] = await connection.query(sql2)
            return true
        }else{
            return  false
        }
    }catch (e){
        return e
    }
}


/*========================================*/
/*
if(params.token){
    const sql = `SELECT * FROM user WHERE auth_token = '${params.token}'`
    const [rows,fileds] = await connection.query(sql)
    let isExist = false
    rows.forEach((item)=>{
        if(item.email){
            isExist = true
            return rows
        }
    })

    if(isExist === false){
        const sql2 = `SELECT * FROM user WHERE id = '${params.id}'`
        const [rows2,fileds2] = await connection.query(sql2)

    }

    //return rows
}else{
    const sql2 = `SELECT id,`
}*/

/*
    [{
    "id":rows[0].id.toString,
    "first name":rows[0].first_name,
    "last name":rows[0].last_name,

    "email":rows[0].email
}]*/

/*
*                 if( params.token && params.token.toString() === rows[0].auth_token){
                    console.log("03")
                    return rows
                    if (rows[0].image_filename === null){
                        rows[0].image_filename = "not exist"
                    }
/*                     "image file name":rows[0].image_filename,
                   console.log([rows[0].id, rows[0].lastname,rows[0].firstname,rows[0].email,rows[0].image_filename])

}else{
    console.log("04")
    //console.log([rows[0].id, rows[0].last_name,rows[0].first_name,rows[0].image_filename])
    return rows
}

 */