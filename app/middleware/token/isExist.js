exports.isExist = function(data){
    try{
        let isExist = false;

        data.forEach(item=>{
            if(item.id){
            isExist = true
        }
    })
    
    return isExist
}catch(e){
    console.log(e)
}
}