const Category = require('../models/category.model')
const Tools = require('../middleware/parseCategory')
/*
exports.list_Category = new Promise((resolve ,reject)=>{
    const category_list = Category.listCategory()
    resolve(category_list)
}).catch(err=>{
    console.log(err)
})*/
//Error: Route.get() requires a callback function but got a [object Promise]








exports.list_Category = async function(){
    try{
        const list_db_object = await Category.listCategory()
        let result = Tools.parseCategory(list_db_object);
        for(index in result){
            console.log(result[index].id);
            console.log(result[index].name);
        }

    }catch(e){
            console.log(`error happened + ${e}`)
    }
}

exports.addCategory = async function(){
    return null;
}

exports.rmCategory = async function(){
    return null;
}
/*

exports.listCategory = async function(){
    return null;
}

exports.listCategory = async function(){
    return null;
}*/
