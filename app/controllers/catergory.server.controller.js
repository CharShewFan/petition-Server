const Category = require('../models/category.model')
const Tools = require('../middleware/parseCategory')

exports.list_Category = async function(req,res){
    try{
        const list_db_object = await Category.listCategory()
        let result = Tools.parseCategory(list_db_object);
        // for(let index in result){
        //     console.log(result[index].id);
        //     console.log(result[index].name);
        // }
        res.status(200)
        res.send(result)

    }catch(e){
        res.status(500)
            console.log(`error happened + ${e}`)
    }
}

exports.addCategory = async function(){
    return null;
}

exports.rmCategory = async function(){
    return null;
}

exports.findCategory = async function(req,res,next){
    console.log("controller called")
    const id = req.params.id
    try{
        let dbResult = await Category.findById(id)
        let result = Tools.parseCategory(dbResult)
        res.json(result)
        res.status(200)
    }catch (e) {
        console.log(e)
        res.status(500)
        res.send("retrieve data from db failed: " + e)
    }
}

/*
exports.listCategory = async function(){
    return null;
}
*/

/*
exports.list_Category = new Promise((resolve ,reject)=>{
    const category_list = Category.listCategory()
    resolve(category_list)
}).catch(err=>{
    console.log(err)
})*/
//Error: Route.get() requires a callback function but got a [object Promise]

