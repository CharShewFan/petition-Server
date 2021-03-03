const events = require('../controllers/event.server.controller');

module.exports = function (app){
    app.route('/events')
        .get(events.listEvents) //list all events and sort by date
        .post(events.addEvents) //need auth , auth user add an event
        .get(events.ownEvents) //auth user list own events

    app.route('/event/:id')
        .get(events.finder) // find events and sort by date
        .delete(events.rmEvents) //need auth
        .patch(events.updateEvents) //need auth


}