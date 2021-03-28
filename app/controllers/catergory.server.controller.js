const Category = require('../models/category.model')
const Tools = require('../middleware/parseCategory')

exports.listAll = async function(req,res){
    console.log("??????????????????")
    try{
        const list_db_object = await Category.listAll()
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

exports.findCategory = async function(req,res){
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

