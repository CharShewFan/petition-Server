const joi = require('joi')

const schema = joi.object( {
    email:joi.string().email().required(),
    password:joi.string().required()
})

exports.loginValid =  function (params){
    return result = schema.validate(params) // result = {error,value}
    //console.log("result.value:  " + result.value)
}
