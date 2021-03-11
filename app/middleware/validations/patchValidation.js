const joi = require('joi')

const schemaEmail = joi.object( {
    email:joi.string().email().required(),
})

const schemaLastName = joi.object( {
    lastName:joi.string().required(),
})

const schemaFirstName = joi.object( {
    firstName:joi.string().required(),
})

const schemaPassword = joi.object( {
    password:joi.string().required()
})

// the worst case is user provide is empty json {}
exports.patchValid =  function (params){
    let error = []
    if(params.email){
        error.push(schemaEmail.validate(params.email))
    }
    if(params.first_name){
        error.push(schemaFirstName.validate(params.first_name))
    }
    if(params.last_name){
        error.push(schemaLastName.validate(params.Last_name))
    }
    if(params.password){
        error.push(schemaPassword.validate(params.password))
    }

    console.log(error[0].error)
    error.forEach(item=>{
        console.log(!item.error)
        return !item.error; // true: error occured , false: validated
    })



   // return schema.validate(params) // result = {error,value}
    //console.log("result.value:  " + result.value)
}


