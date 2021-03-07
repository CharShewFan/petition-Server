exports.validationTest = function(user_name,user_email,user_password,password2){
    if(user_name == null || user_email == ""){
        error.push({userName:"user name empty and null"})
    }
    let emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailPattern.test(user_email) == false){
        error.push({userEmail:"email is not validate"})
    }
    if(user_password !== password2){
        error.push({password:"password does not match"})
    }
    return error
}

exports.reportError = function(error){
    if(error.length != 0){
        for(let errorMsg in error){
            res.send(errorMsg)
        }
    }else{
        return true;
    }
}

