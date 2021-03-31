const events = require('../controllers/event.server.controller');
const category = require('../controllers/catergory.server.controller')

module.exports = function (app){
    app.route(app.rootUrl +'/events')
        .get(events.listEvents) //list all events and sort by date
        .post(events.addEvents) //need auth , auth user add an event

    app.route(app.rootUrl + '/events/:id')
        .get(events.viewById) // find events and sort by date
        .delete(events.rmEvents) //need auth

    app.route(app.rootUrl + 'events/categories')
        .get(category.listAll) // not auth needed, list all category
        .post(category.addCategory) // auth user add a category
        .delete(category.rmCategory) //auth user remove a personal category

    app.route(app.rootUrl + '/events/:id/image')
        .get(events.getImage)
        .post(events.postImage)
        .put(events.postImage)
}