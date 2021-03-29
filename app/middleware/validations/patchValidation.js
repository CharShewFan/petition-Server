const joi = require('joi')

const schema_3 = joi.object( {
    email:joi.string().email(),
    lastName:joi.string(),
    firstName:joi.string(),
    password:joi.string(),
    currentPassword:joi.string()
})


// the worst case is user provide is empty json {}
exports.patchValid =  function (params){

    let result = schema.validate(params) // result = {error,value}
    let valid = true
    let pass = false
    
    if(result.error){
        valid = false
    }

    let passwordTest = true
    if(params.password){
        if(params.currentPassword === undefined){
            passwordTest = false
        }
    }

    if(valid === true && passwordTest === true){
        pass = true
    }

    return pass
    
}


/**
 * 
  {
  "firstName": "Adam",
  "lastName": "Anderson",
  "email": "aaa11@uclive.ac.nz",
  "password": "letmein",
  "currentPassword": "letmein"
}

 **/