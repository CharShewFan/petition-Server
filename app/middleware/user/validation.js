//email Regx:  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

exports.validationTest = function(fisrstName,lastName,user_email,user_password,password2){
    let error = []

    if(fisrstName == "" || fisrstName == null){
        error.push("first name can not be empty")
    }
    if(lastName == "" || lastName == null){
        error.push("last name can not be empty")
    }
    if((fisrstName && lastName) == null || user_email == ""){
        error.push("user name empty and null")
    }
    let emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailPattern.test(user_email) == false){
        error.push("email is not validate")
    }
    if(user_password !== password2){
        error.push("password does not match")
    }

    if(user_password == null || user_password == ""){
        error.push("password empty")
    }

    if(password2 == "" || password2 == null){
        error.push("must fill the confirm password")
    }

    console.log(error)
    return error //return an array call error
}



exports.reportError = function(error){
    if(error.length != 0){ //has error
        for(let i = 0; i < error.length; i++){
            console.log(error[i])
        }
    }else{ // no error
        return true;
    }
}

