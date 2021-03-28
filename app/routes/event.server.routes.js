const events = require('../controllers/event.server.controller');

module.exports = function (app){
    app.route(app.rootUrl +'/events')
        .get(events.listEvents) //list all events and sort by date
        .post(events.addEvents) //need auth , auth user add an event

    app.route(app.rootUrl + '/events/:id')
        .get(events.viewById) // find events and sort by date
        .delete(events.rmEvents) //need auth


}