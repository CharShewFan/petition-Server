const attendance = require('../controllers/catergory.server.controller')

module.exports = function (app) {
    app.router('/category')
        .get(attendance.listCategory) // not auth needed, list all category
        .post(attendance.addCategory) // auth user add a category
        .delete(attendance.rmCategory) //auth user remove a personal category
}