//const { required } = require('joi')
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

const schemaForAddEvent = joi.object({
    title:joi.string().required(),
    description:joi.string().required(),
    categoryIds:joi.array().items(joi.string().alphanum().required())
})

exports.addEventValid = function(params){
    let result = schemaForAddEvent.validate(params)
    console.log(result)
    return (result.error === undefined)

}