exports.sortById = function(result){
    let temp
    for(let i = 0;i < result.length - 1 ; i++){
        for(let j = 0; j < result.length - 1;j++){
            if(result[j].id > result[j+1].id){
                temp = result[j]
                result[j] = result[j+1]
                result[j+1] = temp
            }
        }
    }
    return result


}