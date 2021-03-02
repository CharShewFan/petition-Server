const users = require("../controllers/user.server.controller.js");

module.exports = function (app){
    app.route('/user/:id')
        .get(users.getDetails) //auth user get account details
        .delete(users.rmUser) // delete own account
        .patch(users.updateUser) //auth user update personal detail

    app.route('/user')
        .get(users.listAllUsers)
        .post(users.addUser) // register a user

}