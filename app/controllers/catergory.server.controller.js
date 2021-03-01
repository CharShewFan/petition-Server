const Category = require('../models/category.model')

exports.listCategory = async function(res,req){
    try{
        let category_list = await Category.listCategory()
        res.status(200)
            .send(category_list)
    }catch(e){
        res.status(500)
            .send(`error happened + ${e}`)
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
