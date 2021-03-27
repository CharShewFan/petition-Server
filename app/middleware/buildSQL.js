function convertCate(list){
    let i = 0
    var aList = new Array();
    list.forEach(item=>{
        console.log(typeof(item))
        aList.push(parseInt(list[i]))
        i ++
    })
    console.log(aList)
   return aList
}



 exports.SQL = function(query) {
    // const startIndex = parseInt(query.startIndex)
     //const categoryIds = convertCate(query.categoryIds)
    // const organizerId = parseInt(query.organizerId)




    var sql = `SELECT * FROM event E LEFT JOIN event_category EC ON event_id = E.id `
    
    let value = []
    let conditions = []
    if(query.hasOwnProperty("q")){
        conditions.push("title LIKE ?")
        value.push(`%${query.q}%`)
    }
    if(query.hasOwnProperty("categoryIds") ){
        let categoryIds = convertCate(query.categoryIds)
        conditions.push('EC.category_id IN (?) ')
        value.push(categoryIds)
    }
    if(query.hasOwnProperty("organizerId") &&  isNaN(parseInt(query.organizerId)) === false){
        let organizerId = parseInt(query.organizerId)
        console.log(organizerId)
        conditions.push("organizer_id = ?")
        value.push(organizerId)
    }

  if(conditions.length)  {
      sql += `WHERE ${(conditions ? conditions.join(' AND ') : 1)}`
  }

  switch(query.hasOwnProperty("sortBy")){
      case "DATE_ASC":
          sql += ' ORDER BY date ASC';
          break;

        case "ALPHABETICAL_ASC":
            sql += ' ORDER BY title ASC'
            break;

        case "ALPHABETICAL_DESC":
            sql += ' ORDER BY title DESC'
            break;
        
        case "CAPACITY_ASC":
            sql += 'ORDER BY capacity ASC '
            break;
        case "CAPACITY_DESC":
            sql += ' ORDER BY capacity DESC '
            break;

        case "ATTENDEES_ASC":
            sql += ' ORDER BY attendees ASC '
            break;
        
        case "ATTENDEES_DESC":
            sql += ' ORDER BY attendees DESC '
            break;
            
        case "DATE_DESC":
            default:
                sql += ' ORDER BY date DESC ' 
                break;
  }
if(typeof(query.count) !== undefined &&  isNaN(parseInt(query.count)) === false){
    sql += 'LIMIT ? '
    value.push(parseInt(query.count))
}

if(typeof(query.startIndex) !== undefined &&  isNaN(parseInt(query.startIndex)) === false){
    console.log(isNaN(query.startIndex))
    sql += 'OFFSET ?'
    let startIndex = parseInt(query.startIndex)
    if(startIndex > 11){
        startIndex = 10000000
    }
    value.push(startIndex)
}

console.log(parseInt(query.startIndex))
console.log(parseInt(query.count))
console.log({sql:sql,value:value})
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

