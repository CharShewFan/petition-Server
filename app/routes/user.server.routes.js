const users = require("../controllers/user.server.controller.js");

module.exports = function (app){
    app.route(app.rootUrl + '/users/:id')
        .get(users.getDetails) //auth user get account details
        .delete(users.rmUser) // delete own account
        .patch(users.updateUser) //change part of info in multiple time "idempotence"

    app.route(app.rootUrl + '/users')
        .get(users.listUserDetails)
        
    
    app.route(app.rootUrl + '/users' + '/register')
        .post(users.register)


    app.route(app.rootUrl + '/users/login')
        .post(users.logIn)

    app.route(app.rootUrl + '/users' + '/logout')
        .post(users.logOut)

}