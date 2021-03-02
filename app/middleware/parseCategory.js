exports.parseCategory = function (an_object){
    let content  = [];
    for(index in an_object){
        let id = an_object[index].id ;
        let name =  an_object[index].name ;
       // let string_set = an_object[item_1]
        //console.log("item_1 is " + item_1)
       // console.log(typeof (string_set))
        //content.push(string_set.substr(7))
        content.push({id,name})
    }

    return content
}