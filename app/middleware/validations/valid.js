const joi = require('joi')


/*patch user info validation */
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


/*add user registration validation */


const schema = joi.object({
    firstName:joi.string().required(),
    lastName:joi.string().required(),
    password:joi.string().required(),
    email:joi.string().required().email()
})

exports.registerValid = function(params){
    return schema.validate(params)
}


/*add event validation */

const schemaForAddEvent = joi.object({
    title:joi.string().required(),
    description:joi.string().required(),
    categoryIds:joi.array().items(
        joi.string(),
        joi.number(),
        joi.required()
    ),
    date:[joi.string(),joi.number()],
    image_filename:joi.string(),
    url:joi.string(),
    venue:joi.string(),
    capacity:joi.number(),
    requires_attendance:joi.number(),
    fee:[joi.string(),joi.number()],
    organizer_id:joi.number()
})

exports.addEventValid = function(params){
    let result = schemaForAddEvent.validate(params)
    console.log(result)
    return (result.error === undefined)

}

/*user login validation */
const schema_login = joi.object( {
    email:joi.string().email().required(),
    password:joi.string().required()
})

exports.loginValid =  function (params){
    return schema_login.validate(params) // result = {error,value}
    //console.log("result.value:  " + result.value)
}
