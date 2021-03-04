exports.count = function(result,count){
    let countNum = count
    let list = []
    for(let i = 0; i < count; i++){
        list.push(result[i])
    }
    return list
}