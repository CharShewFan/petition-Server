const events = require('../controllers/event.server.controller');

module.exports = function (app){
    app.route('/events')
        .get(events.listEvents) //list all events
        .post(events.addEvents) //need auth , auth user add an event
        .get(events.ownEvents) //auth user list own events

    app.route('/event/:id')
        .get(events.finder) // find events by id or category ?
        .delete(events.rmEvents) //need auth
        .push(events.updateEvents) //need auth


}