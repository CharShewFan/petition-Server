exports.authGet = function(data){
    let schema = {
        "firstName":"",
        "lastname":"",
        "email":""
    }

    schema.firstName = data.first_name
    schema.lastname = data.last_name
    schema.email = data.email

    return schema
}

exports.unauthGet = function(data){
    let schema = {
        "firstName":"",
        "lastname":""
    }

    schema.firstName = data.first_name
    schema.lastname = data.last_name

    return schema

}