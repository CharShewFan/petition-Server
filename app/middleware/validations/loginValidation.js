const joi = require('joi')

const schema = joi.object( {
    email:joi.string().email().required(),
    password:joi.string().required()
})

exports.check =  function (params){
    return schema.validate(params) // result = {error,value}
    //console.log("result.value:  " + result.value)
}


