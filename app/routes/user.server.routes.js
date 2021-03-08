const users = require("../controllers/user.server.controller.js");

module.exports = function (app){
    app.route(app.rootUrl + '/user/:id')
        //.get(users.getDetails) //auth user get account details
        .delete(users.rmUser) // delete own account
        .patch(users.updateUser) //auth user update personal detail

    app.route(app.rootUrl + '/user')
        .get(users.listUserDetails)
        
    
    app.route(app.rootUrl + '/users' + "/register")// register a user
        .post(users.addUser)

}