const attendance = require('../controllers/attendance.server.controller')

module.exports = function (app) {
    app.route(app.rootUrl + '/events/:id/attendees')
        .get(attendance.viewAtt) // not auth needed, list all category
        .post(attendance.addAtt) // auth user add a category
        .delete(attendance.rmAtt) //auth user remove a personal category
}