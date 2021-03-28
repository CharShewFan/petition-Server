const joi = require('joi')

const schema_3 = joi.object( {
    email:joi.string().email(),
    lastName:joi.string(),
    firstName:joi.string(),
    password:joi.string()
})


// the worst case is user provide is empty json {}
exports.patchValid =  function (params){
    let error = []
    if(params){
        error.push(schema_3.validate(params))
    }
    console.log(error[0].error)
    error.forEach(item=>{
        console.log(!item.error)
        return !item.error; // true: error occured , false: validated
    })



   // return schema.validate(params) // result = {error,value}
    //console.log("result.value:  " + result.value)
}


