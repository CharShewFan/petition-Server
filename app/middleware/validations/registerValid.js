const joi = require('joi')

const schema = joi.object({
    firstName:joi.string().required(),
    lastName:joi.string().required(),
    password:joi.string().required(),
    email:joi.string().required().email()
})

exports.registerValid = function(params){
    return schema.validate(params)
}