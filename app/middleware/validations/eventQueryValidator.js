

exports.check = function(query){
  let error = []
  if(query.q){
      if(typeof(query.q) !== "string" || query.q === "" ){
        error.push("q not valid")
      }
    }

    if(query.categoryIds !== undefined && typeof(query.categoryIds) !== "string"){
      let reg = /\d/
      query.categoryIds.forEach(item=>{
          if( typeof(item) !== "string" && reg.test(parseInt(item)) === false ){
            error.push("categoryId not valid")
          }
      })
      

    if(query.organizerId){
      let reg = /\d/
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

    return (error.length  === 0)
  
}
}


