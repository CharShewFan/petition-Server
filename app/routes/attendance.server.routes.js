const attendance = require('../controllers/catergory.server.controller')

module.exports = function (app) {
    app.router('/events/:id/attendees')
        .get(attendance.viewAtt) // not auth needed, list all category
        .post(attendance.addAtt) // auth user add a category
        .delete(attendance.rmAtt) //auth user remove a personal category
}