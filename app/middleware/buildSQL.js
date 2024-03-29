function convertCate(list){
    let i = 0
    var aList = new Array();
    if(typeof(list) !== "string"){
        list.forEach(item=>{
            console.log(typeof(item))
            aList.push(parseInt(list[i]))
            i ++
        })
        console.log(aList)
        return aList
    }
}



 exports.SQL = function(query) {

    var sql = `select eventId,title,categories,firstName as organizerFirstName,lastName as organizerLastName,number as numAcceptedAttendees,capacity from 
    (SELECT e.id as eventId,title,ec.categories,u.first_name as firstName, u.Last_name as lastName,number,capacity,e.organizer_id,e.date,e.description FROM event as e 
    join user as u on u.id = e.organizer_id
    join (SELECT event_id ,count(*) as number from event_attendees WHERE attendance_status_id = 1 GROUP BY event_id) as attNum on e.id = attNum.event_id
    join (SELECT GROUP_CONCAT(category_id) as categories,event_id from event_category GROUP by event_id) as ec on ec.event_id = e.id
    order by e.id ASC) as newTable`

    let value = []
    let conditions = []
    if(query.hasOwnProperty("q")){
        conditions.push("title LIKE ? or description like ?")
        value.push(`%${query.q}%`)
        value.push(`%${query.q}%`)
    }
    if(query.hasOwnProperty("categoryIds") ){
        let categoryIds = convertCate(query.categoryIds)
        conditions.push('categories IN (?) ')
        value.push(categoryIds)
    }
    if(query.hasOwnProperty("organizerId") &&  isNaN(parseInt(query.organizerId)) === false){
        let organizerId = parseInt(query.organizerId)
        console.log(organizerId)
        conditions.push("organizer_id = ?")
        value.push(organizerId)
    }

  if(conditions.length)  {
      sql += ` WHERE ${(conditions ? conditions.join(' AND ') : 1)}`
  }

  if(query.hasOwnProperty("sortBy")){
        if(query.sortBy === "DATE_ASC") { 
          sql += ' ORDER BY date ASC'
        }
        if(query.sortBy === "ALPHABETICAL_ASC"){
            sql += ' ORDER BY title ASC'
        }
        if(query.sortBy === "ALPHABETICAL_DESC"){
            sql += ' ORDER BY title DESC'
        }
        if(query.sortBy === "CAPACITY_ASC"){
            sql += 'ORDER BY capacity ASC '
        }
        if(query.sortBy === "CAPACITY_DESC"){
            sql += 'ORDER BY capacity DESC '
        }
        if(query.sortBy === "ATTENDEES_ASC"){
            sql += ' ORDER BY numAcceptedAttendees ASC '
        }
        if(query.sortBy === "ATTENDEES_DESC"){
            sql += ' ORDER BY numAcceptedAttendees DESC '
        }
  }else{
    sql += ' ORDER BY date DESC '  
  }
if(typeof(query.count) !== undefined &&  isNaN(parseInt(query.count)) === false){
    sql += 'LIMIT ? '
    value.push(parseInt(query.count))
}

if(typeof(query.startIndex) !== undefined &&  isNaN(parseInt(query.startIndex)) === false){
  
    let startIndex = parseInt(query.startIndex)
    if(startIndex < 11){
        sql += 'OFFSET ?'
        value.push(startIndex)
    }
    
}

return {sql:sql,value:value}
}


// const queryString = {
//     q: 'the',
//     categoryIds: [ '6', '11' ],
//     organizerId: '3',
//     sortBy: 'DATE_ASC',
//     count: '5',
//     startIndex: '0'
// }

// console.log(SQL(queryString))

const postSQL = {
	"title": "Film Club",
	"description": "Meetup with others to watch interesting movies.",
    "venue": "Haere-roa",
	"categoryIds": [14,17,23],
	"date": "2021-07-02 18:25:00"
}

exports.addEvent = function(body,id){
    let query = ""
    let value = []
    if(body.hasOwnProperty("title")){
        query += "title,"
        value.push([body.title])
    }
    if(body.hasOwnProperty("description")){
        query += "description,"
        value.push([body.description])
    }
    if(body.hasOwnProperty("date")){
        query += "date,"
        value.push([body.date])
    }
    if(body.hasOwnProperty("image_filename")){
        query += "image_filename,"
        value.push(body.image_filename)
    }
    if(body.hasOwnProperty("is_online")){
        query += "is_online,"
        value.push(body.is_online)
    }
    if(body.hasOwnProperty("url")){
        query += "url,"
        value.push([body.url])
    }
    if(body.hasOwnProperty("venue")){
        query += "venue,"
        value.push([body.venue])
    }
    if(body.hasOwnProperty("capacity")){
        query += "capacity,"
        value.push([body.capacity])
     }
    //else{
    //     query += "capacity,"
    //     value.push(null)
    // }
    if(body.hasOwnProperty("requires_attendance_control")){
        query += "requires_attendance_control,"
        value.push(body.requires_attendance_control)
    }
    if(body.hasOwnProperty("fee")){
        query += "fee,"
        value.push([body.fee])
    }

    query += "organizer_id"
    value.push([id])

    console.log(query)
    console.log(value)
    let sql = `INSERT INTO event (${query}) VALUES (?)`
    console.log(sql)
    return {"sql":sql,"value":value}
}

// user patch endpoint
exports.userPatch = function(params,id){
    let value = []
    let condition = []
    let query = "UPDATE user SET "
    // const sql = `UPDATE user SET email=${params.email},first_name=${first_name},last_name=${params.last_name},image_filename=${params.image_filename},password=${params.password},auth_token=${params.auth_token} WHERE id = ${params.id}`
    if(params.hasOwnProperty("email")){
        condition.push(`email = '${params.email}' `)
        value.push(params.email)
    }
    if(params.hasOwnProperty("firstName")){
        condition.push(`first_name = '${params.firstName}'`) 
        value.push(params.firstName)
    }
    if(params.hasOwnProperty("lastName")){
        condition.push(`last_name = '${params.lastName}'`)
        value.push(params.lastName)
    }
    if(params.hasOwnProperty("password")){
        condition.push( `password = '${params.password}'`)
        value.push(params.password)
    }

    query += condition.join()
    query += ` WHERE id = ${id}`


    console.log(query)
    console.log(value)
    return query

}