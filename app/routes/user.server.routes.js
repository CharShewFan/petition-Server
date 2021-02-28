const users = require("../controllers/user.server.controller.js");

module.exports = function (app){
    app.route('/user/:id')
        .get(users.getDetails)
        .delete(users.rmUser)
        .patch(users.updateUser)

    app.route('/user')
        .post(users.addUser)

    app.route('/')

}