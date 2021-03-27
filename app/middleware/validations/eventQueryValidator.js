


exports.check = function(query){
  let error = []
  if(query.q){
      if(typeof(query.q) !== "string" || query.q === "" ){
        error.push("q not valid")
      }
    }

    if(query.categoryIds){
      let reg = /\d/
      query.categoryIds.forEach(item=>{
        if( typeof(item) !== "string" && reg.test(parseInt(item)) === false  ){
          error.push("categoryId not valid")
        }
      })
    }

    if(query.organizerId){
      let reg = /\d/
      // console.log(typeof(query.organizerId))
      // console.log(reg.test(parseInt(query.organizerId)))
      if(typeof(query.organizerId) !== "string" || reg.test(parseInt(query.organizerId)) === false){
        error.push("invalied organizerId")
      }
    }

    if(query.sortBy){
      if(typeof(query.sortBy) !== "string"){
        error.push("invalided sortBy")
      }
    }

    if(query.count){
      let reg = /\d/
      if(typeof(query.count) !== "string" || reg.test(parseInt(query.count) === false)){
        error.push("invalied count")
      }
    }

    if(query.startIndex){
      let reg = /\d/
      if(typeof(query.startIndex) !== "string" || reg.test(parseInt(query.count) === false)){
        error.push("invalied startIndex")
      }
    }

    // console.log(error)
    // console.log(error.length)
    
    return (error.length  === 0)
  
}

//传入的数据必须为 json 结构
/*意味着要对 [
  [ 'q', 'the' ],
  [ 'categoryIds', [ '6', '11' ] ],
  [ 'organizerId', '3' ],
  [ 'sortBy', 'DATE_ASC' ],
  [ 'count', '' ],
  [ 'startIndex', '0' ]
]
进行转化



let queryStr = {
  q: 'the',
  categoryIds: [ '6', '11' ],
  organizerId: '3',
  sortBy: 'DATE_ASC',
  count: '5',
  startIndex: '0'
}

console.log(querys(queryStr))
*/




